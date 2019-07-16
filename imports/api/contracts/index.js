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
    'contracts.insert'(master) {
      const prefix = new Date().getFullYear();
      const suffix = Contracts.find({ _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(3, '0');
      const _id = prefix + "-" + suffix;
      const data = {
        // System Information
        _id,
        status: master.status,
        createdBy: master.createdBy,
        visible: true,
        // Contract Information
        clientId: master.clientId,
        proposal: master.proposal,
        proposalVersion: master.proposalVersion,
        deliveryAddress: master.deliveryAddress,
        dates: master.dates,
        discount: master.discount,

        version: master.version,
        negociatorId: master.negociatorId,
        representativesId: master.representativesId,

        inss: master.inss,
        iss: master.iss,
        billingProducts: master.billingProducts,
        billingServices: master.billingServices,

        observations: master.observations,
        shipping: {},

        containers: setProducts(master.containers),
        accessories: setProducts(master.accessories),
        services: setProducts(master.services)

      };
      Contracts.insert(data);
      Meteor.call('history.insert', data, 'contracts');
      return _id;
    },
    'contracts.update'(master) {
      var current = Contracts.findOne({_id: master._id});
      var hasChanged = !tools.compare(current, master);
      if (!hasChanged) return {hasChanged: false};

      const data = {
        // System Information
        _id: master._id,
        // Contract Information
        status: master.status,
        clientId: master.clientId,
        proposal: master.proposal,
        deliveryAddress: master.deliveryAddress,
        dates: master.dates,
        discount: master.discount,

        version: hasChanged ? master.version+1 : master.version,
        negociatorId: master.negociatorId,
        representativesId: master.representativesId,

        inss: master.inss,
        iss: master.iss,
        billingProducts: master.billingProducts,
        billingServices: master.billingServices,

        observations: master.observations,

        containers: setProducts(master.containers),
        accessories: setProducts(master.accessories),
        services: setProducts(master.services)

      };
      Contracts.update({ _id: master._id }, { $set: data });
      Meteor.call('history.insert', data, 'contracts');
      return {hasChanged: true};
    },
    'contracts.activate'(master) {
      var _id = master._id;
      master.status = "active";
      if (!_id) {
        _id = Meteor.call('contracts.insert', master);
      } else {
        Meteor.call('contracts.update', master);
      }
      Meteor.call('history.insert', { _id }, 'contracts.activate');
      return _id;
    },
    'contracts.finalize'(master) {
      Meteor.call('contracts.update', {...master, status: "finalized"});
      Meteor.call('history.insert', {_id: master._id}, 'contracts.finalize');
      return master._id;
    },
    'contracts.cancel'(master) {
      Proposals.update({_id: master.proposal}, {$set: {status: "cancelled"}});
      Contracts.update({_id: master._id}, {$set: {status: "cancelled"}});
      Meteor.call('history.insert', {_id: master._id}, 'contracts.cancel');
      return master._id;
    },
    'contracts.shipping.send'(_id, master) {
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
    'contracts.shipping.receive'(_id, master) {
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