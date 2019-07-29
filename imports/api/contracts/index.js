import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

import { Proposals } from '/imports/api/proposals/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

export const Contracts = new Mongo.Collection('contracts');

if (Meteor.isServer) {
  Meteor.publish('contractsPub', () => {
    return Contracts.find({}, {sort: { _id: -1 }});
  })
  function setProducts(array) {
    return array.map((item) => {
      delete item.description;
      delete item.restitution;
      return item;
    })
  }

  Meteor.methods({
    'contracts.insert'(data) {
      const prefix = new Date().getFullYear();
      const suffix = Contracts.find({ _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(3, '0');
      const _id = prefix + "-" + suffix;

      data._id = _id;

      Contracts.insert(data);
      Meteor.call('history.insert', data, 'contracts.insert');
      return _id;
    },
    'contracts.update'(snapshot) {
      var _id = snapshot._id;
      var index = snapshot.version;
      var data = Contracts.findOne({ _id });
      var hasChanged = !tools.compare(data.snapshots[index], snapshot, "activeVersion");
      if (!hasChanged) return { hasChanged: false, snapshot };

      const newSnapshot = {
        ...snapshot,
        _id: undefined,
        version: undefined,
        status: undefined,
        activeVersion: undefined,

        containers: setProducts(snapshot.containers),
        accessories: setProducts(snapshot.accessories),
        services: setProducts(snapshot.services)
      };

      data.snapshots.push(newSnapshot);
      data.activeVersion = snapshot.version;

      Contracts.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'contracts.update');
      return { hasChanged: true, data };
    },
    'contracts.activate'(contract) {
      var _id = contract._id;
      Contracts.update({ _id }, { $set: {
        status: "active",
        activeVersion: Number(contract.version)
      } })
      Meteor.call('history.insert', { _id }, 'contracts.activate');
      return { _id };
    },
    'contracts.finalize'(_id) {
      Contracts.update({ _id }, { $set: { status: "finalized" } } );
      Meteor.call('history.insert', { _id }, 'contracts.finalize');
      return _id;
    },
    'contracts.cancel'(_id, proposalId) {
      Proposals.update({ _id: proposalId }, { $set: {status: "cancelled"} });
      Contracts.update({ _id }, { $set: { status: "cancelled" } } );
      Meteor.call('history.insert', { _id }, 'contracts.cancel');
      return _id;
    },
    'contracts.shipping.send'(master) {
      var _id = master._id;
      var oldShipping = Contracts.findOne({ _id }).shipping;

      shipping = {
        ...oldShipping,
        fixed: master.fixed,
        modules: master.modules,
        accessories: master.accessories
      };

      function updateModule(product, module) {
        var place = tools.deepCopy(product.place);
        var rented = product.rented;
        module.selected.forEach((moduleSelected) => {
          var exists = place.findIndex((item) => item._id === moduleSelected.place);
          if (exists > -1) {
            place[exists].available = place[exists].available - moduleSelected.selected;
            if (place[exists].available < 0) throw new Meteor.Error('product-already-rented');
            rented = rented + moduleSelected.selected;
          } else throw new Meteor.Error('product-already-rented');
        })
        return {
          ...product,
          rented,
          place
        }
      }

      function updateAccessory(product, accessory) {
        var variations = product.variations.map((variation, i) => {
          var place = tools.deepCopy(variation.place);
          var rented = variation.rented;
          accessory.selected.forEach((accessorySelected) => {
            if (i === accessorySelected.variationIndex) {
              var exists = place.findIndex((item) => item._id === accessorySelected.place);
              if (exists > -1) {
                place[exists].available = place[exists].available - accessorySelected.selected;
                if (place[exists].available < 0) throw new Meteor.Error('product-already-rented');
                rented = rented + accessorySelected.selected;
              } else throw new Meteor.Error('product-already-rented' + accessorySelected.place);
            }
          })
          return {
            ...variation,
            rented,
            place
          }
        })
        return {
          ...product,
          variations
        }
      }

      const executeRent = (isSimulation) => {
        shipping.fixed.forEach((fixed) => {
          var productFromDatabase = Series.findOne({ _id: fixed.seriesId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          if (productFromDatabase.place === "rented") throw new Meteor.Error('product-already-rented');
          if (!isSimulation) Meteor.call('series.update', {place: "rented"}, fixed.seriesId);
        })
        shipping.modules.forEach((module) => {
          var productFromDatabase = Modules.findOne({ _id: module.productId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          productFromDatabase = updateModule(productFromDatabase, module);
          if (!isSimulation) Meteor.call('modules.shipping.send', productFromDatabase);
        })
        shipping.accessories.forEach((accessory) => {
          var productFromDatabase = Accessories.findOne({ _id: accessory.productId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          productFromDatabase = updateAccessory(productFromDatabase, accessory);
          if (!isSimulation) Meteor.call('accessories.shipping.send', productFromDatabase);
        })
        return true;
      }

      executeRent(true);
      executeRent(false);

      var history = {
        date: new Date(),
        type: 'sendAll',
        _id: tools.generateId()
      };

      shipping.history ? shipping.history.push(history) : shipping.history = [history];

      Contracts.update({ _id }, { $set: { shipping } });
      Meteor.call('history.insert', {...history, contractId: _id}, 'contracts.shipping.send');
      return true;
    },
    'contracts.shipping.receive'(master) {
      var _id = master._id;
      var oldShipping = Contracts.findOne({ _id }).shipping;

      shipping = {
        ...oldShipping,
        fixed: [],
        modules: [],
        accessories: []
      };

      function updateModule(product, module) {
        var place = tools.deepCopy(product.place);
        var rented = product.rented;
        module.selected.forEach((moduleSelected) => {
          var exists = place.findIndex((item) => item._id === module.place);
          if (exists > -1) {
            place[exists].available = place[exists].available + moduleSelected.selected;
          } else {
            place.push({
              _id: module.place,
              available: moduleSelected.selected,
              inactive: 0
            })
          }
          rented = rented - moduleSelected.selected;
        })
        return {
          ...product,
          rented,
          place
        }
      }

      function updateAccessory(product, accessory) {
        var variations = product.variations.map((variation, i) => {
          var place = tools.deepCopy(variation.place);
          var rented = variation.rented;

          if (i === accessory.variationIndex) {
            var exists = place.findIndex((item) => item._id === accessory.place);
            if (exists > -1) {
              place[exists].available = place[exists].available + accessory.selected;
            } else {
              place.push({
                _id: accessory.place,
                available: accessory.selected,
                inactive: 0
              })
            }
            rented = rented - accessory.selected;
          }
          return {
            ...variation,
            rented,
            place
          }
        })
        return {
          ...product,
          variations
        }
      }

      const executeReceive = () => {
        master.fixed.forEach((fixed) => {
          Meteor.call('series.update', {place: fixed.place}, fixed.seriesId);
        })
        master.modules.forEach((module) => {
          var productFromDatabase = Modules.findOne({ _id: module.productId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          productFromDatabase = updateModule(productFromDatabase, module);
          Meteor.call('modules.shipping.receive', productFromDatabase);
        })
        master.accessories.forEach((accessory) => {
          var productFromDatabase = Accessories.findOne({ _id: accessory.productId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          productFromDatabase = updateAccessory(productFromDatabase, accessory);
          Meteor.call('accessories.shipping.receive', productFromDatabase);
        })
        return true;
      }

      executeReceive();

      var history = {
        date: new Date(),
        type: 'receiveAll',
        _id: tools.generateId()
      };

      shipping.history ? shipping.history.push(history) : shipping.history = [history];

      Contracts.update({ _id }, { $set: { shipping } });
      Meteor.call('history.insert', {...history, contractId: _id}, 'contracts.shipping.receive');
      return true;
    }
  })
}