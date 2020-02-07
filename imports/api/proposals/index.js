import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';

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
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Proposals.find({}, {
        sort: { _id: -1 },
        limit: limit || 0
      }
    );
  })

  Meteor.methods({
    'proposals.insert'(snapshot) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const prefix = new Date().getFullYear();
      const suffix = Proposals.find({
        _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(4, '0');
      var _id = prefix + "-" + suffix;

      snapshot = schema('proposals', 'full').clean(snapshot);
      schema('proposals', 'full').validate(snapshot);

      var proposal = {
        _id,
        status: "inactive",
        snapshots: [
          snapshot
        ]
      };
      Proposals.insert(proposal);
      Meteor.call('history.insert', proposal, 'proposals.insert');
      return proposal;
    },
    'proposals.update'(snapshot, _id, index) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var oldProposal = Proposals.findOne({ _id });
      var hasChanged = !tools.compare(
        oldProposal.snapshots[index], snapshot
      );
      if (!hasChanged) {
        return {hasChanged: false};
      }

      schema('proposals', 'full').validate(snapshot);

      Proposals.update({ _id },
        {$push: { snapshots: snapshot }}
      )
      Meteor.call('history.insert', {_id, ...snapshot}, 'proposals.update');
      return {
        hasChanged: true,
        snapshot,
        index: oldProposal.snapshots.length
      };
    },
    'proposals.activate'(_id, index) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var proposal = Proposals.findOne({ _id });
      var backupProposal = {...proposal};

      proposal.status = 'active';
      proposal.snapshots[index].active = true;
      delete proposal._id;

      Proposals.update({ _id }, proposal);
      Meteor.call('history.insert', { _id }, 'proposals.activate');

      try {
        var contractId = Meteor.call('contracts.insert', _id);
        return contractId;
      }
      catch(err) {
        Proposals.update({ _id }, backupProposal);
        throw new Meteor.Error(err);
      }



      // try {
      //   var _id = master._id;
      //   var contractId = Meteor.call('contracts.insert', {
      //     status: 'inactive',
      //     proposal: _id,
      //     proposalVersion: Number(master.version),
      //     activeVersion: undefined,
      //     shipping: [],
      //     snapshots: [
      //       {
      //         createdBy: master.createdBy,
      //         clientId: '',
      //         discount: master.discount,
      //         observations: master.observations,
      //         deliveryAddress: master.deliveryAddress,
      //         dates: master.dates,
      //         billingProducts: [],
      //         billingServices: [],
      //         containers: master.containers,
      //         accessories: master.accessories,
      //         services: master.services
      //       }
      //     ]
      //   })
      //   Proposals.update({ _id }, { $set: {
      //     status: "active",
      //     activeVersion: Number(master.version)
      //   } })
      //   Meteor.call('history.insert', { _id }, 'proposals.activate');
      //   return { proposal: Proposals.findOne({ _id }), contractId };
      // }
      // catch(err){
      //   throw new Meteor.Error(err);
      // }
    },
    'proposals.cancel'(_id) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      Proposals.update({ _id }, { $set: { status: "cancelled" } } );
      Meteor.call('history.insert', { _id }, 'proposals.cancel');
      return _id;
    }
  })
}