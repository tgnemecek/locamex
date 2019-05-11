import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Contracts = new Mongo.Collection('contracts');

if (Meteor.isServer) {
  Meteor.publish('contractsPub', () => {
    return Contracts.find({ visible: true }, {sort: { _id: -1 }});
  })
  function setProducts(array) {
    return array.map((item) => {
      delete item.description;
      delete item.restitution;
      return item;
    })
  }

  Meteor.methods({
    'contracts.insert'(state) {
      const prefix = new Date().getFullYear();
      const suffix = Contracts.find({ _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(3, '0');
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
      Contracts.insert(data);
      Meteor.call('history.insert', data, 'contracts');
      return _id;
    },
    'contracts.update'(state) {
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
      Contracts.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'contracts');
    },
    'contracts.activate'(state) {
      const activate = (_id) => {
        const data = {
          ...state,
          _id: _id || state._id,
          status: "active"
        }
        var modules = [];
        for (var i = 0; i < data.containers.length; i++) {
          if (data.containers[i].type === 'modular') {''
            data.containers[i].modules.forEach((module) => {
              var stillAvailable = Meteor.call('modules.check', module._id, module.renting);
              if (!stillAvailable) {
                throw new Meteor.Error ("module-not-available",
                "O componente " + module._id + " não está mais disponível na quantidade desejada.");
              }
              module.renting = module.renting * data.containers[i].renting;
            })
            modules = modules.concat(data.containers[i].modules);
          } else if (data.containers[i].type === 'fixed') {
            var stillAvailable = Meteor.call('containers.check', data.containers[i]._id);
            if (!stillAvailable) {
              throw new Meteor.Error ("container-not-available",
              "O container " + data.containers[i]._id + " não está mais disponível.");
            }
            Meteor.call('containers.status', data.containers[i]._id, "rented");
          } else if (data.containers[i].type === 'pack') {
            var stillAvailable = Meteor.call('packs.check', data.containers[i]._id);
            if (!stillAvailable) {
              throw new Meteor.Error ("container-not-available",
              "O container " + data.containers[i]._id + " não está mais disponível.");
            }
            Meteor.call('packs.rent', data.containers[i]._id);
          }
        }
        for (var i = 0; i < data.accessories.length; i++) {
          var stillAvailable = Meteor.call('accessories.check', data.accessories[i]._id, data.accessories[i].renting);
          if (!stillAvailable) {
            throw new Meteor.Error ("accessory-not-available",
            "O acessório " + data.accessories[i]._id + " não está mais disponível na quantidade desejada.");
          }
        }
        Meteor.call('accessories.rent', data.accessories);
        Meteor.call('modules.rent', modules);
        Meteor.call('contracts.update', data);
        Meteor.call('history.insert', data, 'contracts');
        return data._id;
      }
      if (!state._id) {
        var _id = Meteor.call('contracts.insert', state);
        return activate(_id);
      } else return activate();
    },
    'contracts.finalize'(_id, containers, accessories) {
      const data = {
        _id,
        status: "finalized"
      }
      var modules = [];
      for (var i = 0; i < containers.length; i++) {
        if (containers[i].type !== 'fixed') {
          if (containers[i].selectedAssembled > 0) {
            Meteor.call('packs.insert', containers[i]);
          }
          containers[i].modules.forEach((module) => {
            module.renting = module.renting * (containers[i].renting - containers[i].selectedAssembled);
          })
          modules = modules.concat(containers[i].modules);
        } else {
          Meteor.call('containers.status', containers[i]._id, "available");
        }
      }
      Meteor.call('accessories.receive', accessories);
      Meteor.call('modules.receive', modules);
      Meteor.call('contracts.update.one', _id, {status: "finalized"});
      Meteor.call('history.insert', data, 'contracts');
      return data._id;
    },
    'contracts.update.one'(_id, update) {
      const data = {
        ...update,
        _id
      }
      Contracts.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'contracts.update.one');
    },
    'contracts.shipping.send'(_id, state) {
      var oldShipping = Contracts.findOne({ _id }).shipping;

      shipping = {
        ...oldShipping,
        fixed: state.fixed,
        modules: state.modules,
        accessories: state.accessories
      };

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
    'contracts.shipping.receive'(_id, state) {
      var oldShipping = Contracts.findOne({ _id }).shipping;

      shipping = {
        ...oldShipping,
        fixed: [],
        modules: [],
        accessories: []
      };

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