import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';
import {
  insertSchema,
  updateSchema
} from './schemas';

import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

export const Proposals = new Mongo.Collection('proposals');

Proposals.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('proposalsPub', (limit) => {
    return Proposals.find({}, {
        sort: { _id: -1 },
        limit: limit || 0
      }
    );
  })

  Meteor.methods({
    'proposals.insert'(snapshot) {
      const prefix = new Date().getFullYear();
      const suffix = Proposals.find({
        _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(4, '0');
      var _id = prefix + "-" + suffix;

      snapshot = insertSchema.clean(snapshot);
      insertSchema.validate(snapshot);

      var proposal = {
        _id,
        status: "inactive",
        snapshots: [
          snapshot
        ]
      };
      Proposals.insert(data);
      Meteor.call('history.insert', data, 'proposals.insert');
      return data;
    },
    'proposals.update'(snapshot) {
      var _id = snapshot._id;
      var index = snapshot.version;
      var data = Proposals.findOne({ _id });
      var hasChanged = !tools.compare(data.snapshots[index], snapshot, "activeVersion");
      if (!hasChanged) return { hasChanged: false, proposal: data };

      const newSnapshot = {
        ...snapshot,
        _id: undefined,
        version: undefined,
        status: undefined,
        activeVersion: undefined,

        containers: snapshot.containers,
        accessories: snapshot.accessories,
        services: snapshot.services
      };

      data.snapshots.push(newSnapshot);

      Proposals.update({ _id }, { $set: data } );
      Meteor.call('history.insert', data, 'proposals.update');
      return { hasChanged: true, proposal: data };
    },
    'proposals.activate'(master) {
      try {
        var _id = master._id;
        var contractId = Meteor.call('contracts.insert', {
          status: 'inactive',
          proposal: _id,
          proposalVersion: Number(master.version),
          activeVersion: undefined,
          shipping: [],
          snapshots: [
            {
              createdBy: master.createdBy,
              clientId: '',
              discount: master.discount,
              observations: master.observations,
              deliveryAddress: master.deliveryAddress,
              dates: master.dates,
              billingProducts: [],
              billingServices: [],
              containers: master.containers,
              accessories: master.accessories,
              services: master.services
            }
          ]
        })
        Proposals.update({ _id }, { $set: {
          status: "active",
          activeVersion: Number(master.version)
        } })
        Meteor.call('history.insert', { _id }, 'proposals.activate');
        return { proposal: Proposals.findOne({ _id }), contractId };
      }
      catch(err){
        throw new Meteor.Error(err);
      }
    },
    'proposals.cancel'(_id) {
      Proposals.update({ _id }, { $set: { status: "cancelled" } } );
      Meteor.call('history.insert', { _id }, 'proposals.cancel');
      return _id;
    }
    // NOT IN USE:
    // 'proposals.duplicate'(master) {
    //   var current = Proposals.findOne({_id: master._id});
    //   var hasChanged = !tools.compare(current.snapshots[master.version], master);
    //   var newMaster = master;
    //
    //   if (hasChanged) {
    //     newMaster = Meteor.call('proposals.update', master).master;
    //   }
    //
    //   delete newMaster._id;
    //   master.snapshots = [];
    //
    //   var _id = Meteor.call('proposals.insert', newMaster);
    //   Meteor.call('history.insert', {...newMaster, _id}, 'proposals.duplicate');
    //   return _id;
    // }
  })
}