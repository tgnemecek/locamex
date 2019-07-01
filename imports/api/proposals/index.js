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
    'proposals.insert'(master) {
      const prefix = new Date().getFullYear();
      const suffix = Proposals.find({ _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(4, '0');
      const _id = prefix + "-" + suffix;
      const data = {
        // System Information
        _id,
        status: master.status,
        createdBy: master.createdBy,
        visible: true,
        // Contract Information
        client: master.client,
        deliveryAddress: master.deliveryAddress,
        dates: master.dates,
        discount: master.discount,

        version: master.version,

        inss: master.inss,
        iss: master.iss,
        billingProducts: master.billingProducts,
        billingServices: master.billingServices,

        observations: master.observations,

        containers: setProducts(master.containers),
        accessories: setProducts(master.accessories),
        services: setProducts(master.services)

      };
      Proposals.insert(data);
      Meteor.call('history.insert', data, 'proposals');
      return _id;
    },
    'proposals.update'(master) {
      var current = Proposals.findOne({_id: master._id});
      var hasChanged = !tools.compare(current, master);
      if (!hasChanged) return {hasChanged: false};

      const data = {
        // System Information
        _id: master._id,
        // Contract Information
        status: master.status,
        client: master.client,
        deliveryAddress: master.deliveryAddress,
        dates: master.dates,
        discount: master.discount,

        version: hasChanged ? master.version+1 : master.version,

        inss: master.inss,
        iss: master.iss,
        billingProducts: master.billingProducts,
        billingServices: master.billingServices,

        observations: master.observations,

        containers: setProducts(master.containers),
        accessories: setProducts(master.accessories),
        services: setProducts(master.services)

      };
      Proposals.update({ _id: master._id }, { $set: data });
      Meteor.call('history.insert', data, 'proposals');
      return {hasChanged: true, master};
    },
    'proposals.activate'(master) {
      var _id = master._id;
      master.status = "active";
      if (!_id) {
        _id = Meteor.call('proposals.insert', master);
      } else {
        Meteor.call('proposals.update', master);
      }
      var contractId = Meteor.call('contracts.insert', {
        ...master,
        status: 'inactive',
        proposal: _id,
        proposalVersion: master.version,
        clientId: ''
      })
      Meteor.call('history.insert', { _id }, 'proposals.activate');
      return {_id, contractId};
    },
    'proposals.cancel'(_id) {
      Proposals.update({_id}, {$set: {status: "cancelled"}} );
      Meteor.call('history.insert', {_id}, 'proposals.cancel');
      return _id;
    },
    'proposals.duplicate'(master) {
      var current = Proposals.findOne({_id: master._id});
      var hasChanged = !tools.compare(current, master);
      var newMaster = master;

      if (hasChanged) {
        newMaster = Meteor.call('proposals.update', master).master;
      }

      delete newMaster._id;
      master.version = 1;

      var _id = Meteor.call('proposals.insert', newMaster);
      Meteor.call('history.insert', {...newMaster, _id}, 'proposals.duplicate');
      return _id;
    }
  })
}