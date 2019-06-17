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
        client: state.client,
        deliveryAddress: state.deliveryAddress,
        dates: state.dates,
        discount: state.discount,

        version: state.version,

        inss: state.inss,
        iss: state.iss,
        billingProducts: state.billingProducts,
        billingServices: state.billingServices,

        observations: state.observations,

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
        status: state.status,
        client: state.client,
        deliveryAddress: state.deliveryAddress,
        dates: state.dates,
        discount: state.discount,

        version: state.version,

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
      state.status = "active";
      if (!_id) {
        _id = Meteor.call('proposals.insert', state);
      } else {
        Meteor.call('proposals.update', state);
      }
      Meteor.call('contracts.insert', {
        ...state,
        status: 'inactive',
        proposal: _id,
        proposalVersion: state.version
      })
      Meteor.call('history.insert', { _id }, 'proposals.activate');
      return _id;
    },
    'proposals.cancel'(state) {
      Meteor.call('proposals.update', {...state, status: "cancelled"} );
      Meteor.call('history.insert', {_id: state._id}, 'proposals.cancel');
      return state._id;
    }
  })
}