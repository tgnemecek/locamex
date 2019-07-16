import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

export const Proposals = new Mongo.Collection('proposals');

if (Meteor.isServer) {
  Meteor.publish('proposalsPub', () => {
    return Proposals.find({}, {sort: { _id: -1 }});
  })
  function setProducts(array) {
    return array.map((item) => {
      delete item.description;
      delete item.restitution;
      return item;
    })
  }

  Meteor.methods({
    'proposals.insert'(snapshot, status) {
      const prefix = new Date().getFullYear();
      const suffix = Proposals.find({ _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(4, '0');
      const _id = prefix + "-" + suffix;
      const data = {
        _id,
        status: status || "inactive",
        snapshots: [
          {
            ...snapshot,
            _id: undefined,
            version: undefined,
            status: undefined,

            containers: setProducts(snapshot.containers),
            accessories: setProducts(snapshot.accessories),
            services: setProducts(snapshot.services)
          }
        ]
      };
      Proposals.insert(data);
      Meteor.call('history.insert', data, 'proposals.insert');
      return _id;
    },
    'proposals.update'(snapshot, status) {
      var _id = snapshot._id;
      var index = snapshot.version;
      var data = Proposals.findOne({ _id });
      var hasChanged = !tools.compare(data.snapshots[index], snapshot);
      if (!hasChanged) return { hasChanged: false };

      const newSnapshot = {
        ...snapshot,
        _id: undefined,
        version: undefined,
        status: undefined,

        containers: setProducts(snapshot.containers),
        accessories: setProducts(snapshot.accessories),
        services: setProducts(snapshot.services)

      };

      data.snapshots.push(newSnapshot);
      data.status = status || data.status;

      Proposals.update({ _id }, { $set: data } );
      Meteor.call('history.insert', data, 'proposals.update');
      return { hasChanged: true, data };
    },
    'proposals.activate'(master) {
      var _id = master._id;
      if (!_id) {
        _id = Meteor.call('proposals.insert', master, "active");
      } else {
        Meteor.call('proposals.update', master, "active");
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