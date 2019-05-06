import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';

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
      var _id = state._id || Meteor.call('contracts.insert', state);
      Contracts.update({ _id }, { $set: { status: 'active' } })
      Meteor.call('history.insert', { _id }, 'contracts.activate');
      return _id;
    },
    'contracts.finalize'(_id) {
      Contracts.update({ _id }, { $set: { status: 'finalized' } })
      Meteor.call('history.insert', { _id }, 'contracts.finalize');
      return _id;
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

      // const executeRent = (isSimulation) => {
      //   shipping.fixed.forEach((fixed) => {
      //     var productFromDatabase = Series.findOne({ _id: fixed.seriesId });
      //     if (!productFromDatabase) throw new Meteor.Error('product-not-found');
      //     if (productFromDatabase.place === "rented") throw new Meteor.Error('product-already-rented');
      //     if (!isSimulation) Meteor.call('series.update', {place: "rented"}, fixed.seriesId);
      //   })
      //   shipping.modules.forEach((module) => {
      //     var productFromDatabase = Modules.findOne({ _id: module.productId });
      //     if (!productFromDatabase) throw new Meteor.Error('product-not-found');
      //     if (productFromDatabase.place === "rented") throw new Meteor.Error('product-already-rented'); // PAREI AQUI!!!!!!
      //     if (!isSimulation) Meteor.call('series.update', {place: "rented"}, fixed.seriesId);
      //   })
      //   return true;
      // }
      //
      // executeRent(true);
      // executeRent(false);

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