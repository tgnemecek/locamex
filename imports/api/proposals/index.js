import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

export const Proposals = new Mongo.Collection('proposals');

if (Meteor.isServer) {
  Meteor.publish('proposalsPub', () => {
    return Proposals.find({ visible: true }, {sort: { _id: -1 }});
  })
  function setProducts(array) {
    return array.map((item) => {
      delete item.description;
      delete item.restitution;
      return item;
    })
  }

  Meteor.methods({
    'proposals.insert'(state) {
      const prefix = new Date().getFullYear();
      const suffix = Proposals.find({ _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(3, '0');
      const _id = prefix + "-" + suffix;
      const data = {
        // System Information
        _id,
        status: state.status,
        createdBy: state.createdBy,
        visible: true,
        // Contract Information
        clientId: state.clientId,
        proposal: state.proposal,
        deliveryAddress: state.deliveryAddress,
        dates: state.dates,
        discount: state.discount,

        version: state.version,
        negociatorId: state.negociatorId,
        representativesId: state.representativesId,

        inss: state.inss,
        iss: state.iss,
        billingProducts: state.billingProducts,
        billingServices: state.billingServices,

        observations: state.observations,
        shipping: {},

        containers: setProducts(state.containers),
        accessories: setProducts(state.accessories),
        services: setProducts(state.services)

      };
      Proposals.insert(data);
      Meteor.call('history.insert', data, 'proposals');
      return _id;
    },
    'proposals.update'(state) {
      const data = {
        // System Information
        _id: state._id,
        // Contract Information
        clientId: state.clientId,
        proposal: state.proposal,
        deliveryAddress: state.deliveryAddress,
        dates: state.dates,
        discount: state.discount,

        version: state.version,
        negociatorId: state.negociatorId,
        representativesId: state.representativesId,

        inss: state.inss,
        iss: state.iss,
        billingProducts: state.billingProducts,
        billingServices: state.billingServices,

        observations: state.observations,

        containers: setProducts(state.containers),
        accessories: setProducts(state.accessories),
        services: setProducts(state.services)

      };
      Proposals.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'proposals');
    },
    'proposals.activate'(state) {
      var _id = state._id;
      if (!_id) {
        _id = Meteor.call('proposals.insert', state);
      } else {
        Meteor.call('proposals.update', state);
      }
      Meteor.call('history.insert', { _id }, 'proposals.activate');
      return _id;
    },
    'proposals.finalize'(_id) {
      Proposals.update({ _id }, { $set: { status: 'finalized' } })
      Meteor.call('history.insert', { _id }, 'proposals.finalize');
      return _id;
    },
    'proposals.update.one'(_id, update) {
      const data = {
        ...update,
        _id
      }
      Proposals.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'proposals.update.one');
      return _id;
    },
    'proposals.shipping.send'(_id, state) {
      var oldShipping = Proposals.findOne({ _id }).shipping;

      shipping = {
        ...oldShipping,
        fixed: state.fixed,
        modules: state.modules,
        accessories: state.accessories
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

      Proposals.update({ _id }, { $set: { shipping } });
      Meteor.call('history.insert', {...history, proposalId: _id}, 'proposals.shipping.send');
      return true;
    },
    'proposals.shipping.receive'(_id, state) {
      var oldShipping = Proposals.findOne({ _id }).shipping;

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
        state.fixed.forEach((fixed) => {
          Meteor.call('series.update', {place: fixed.place}, fixed.seriesId);
        })
        state.modules.forEach((module) => {
          var productFromDatabase = Modules.findOne({ _id: module.productId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          productFromDatabase = updateModule(productFromDatabase, module);
          Meteor.call('modules.shipping.receive', productFromDatabase);
        })
        state.accessories.forEach((accessory) => {
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

      Proposals.update({ _id }, { $set: { shipping } });
      Meteor.call('history.insert', {...history, proposalId: _id}, 'proposals.shipping.receive');
      return true;
    }
  })
}