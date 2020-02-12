import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories, accessoriesSchema } from '/imports/api/accessories/index';
import { containersSchema } from '/imports/api/containers/index';
import { servicesSchema } from '/imports/api/services/index';

export const Proposals = new Mongo.Collection('proposals');
Proposals.attachSchema(new SimpleSchema({
  _id: String,
  status: String,
  visible: Boolean,
  snapshots: Array,
  'snapshots.$': new SimpleSchema({
    active: Boolean,
    createdById: String,
    createdByName: String,
    client: {
      type: Object,
      blackbox: true
    },
    discount: Number,
    observations: Object,
    'observations.internal': {
      type: String,
      optional: true
    },
    'observations.external': {
      type: String,
      optional: true
    },
    'observations.conditions': {
      type: String,
      optional: true
    },
    deliveryAddress: {
      type: Object,
      blackbox: true
    },
    dates: Object,
    'dates.creationDate': Date,
    'dates.startDate': Date,
    'dates.duration': SimpleSchema.Integer,
    'dates.creationDate': Date,
    'dates.timeUnit': {
      type: String,
      allowedValues: ['months', 'days']
    },

    containers: Array,
    'containers.$': Object,
    'containers.$._id': String,
    'containers.$.type': String,
    'containers.$.description': String,
    'containers.$.restitution': Number,
    'containers.$.price': Number,
    'containers.$.renting': SimpleSchema.Integer,

    accessories: Array,
    'accessories.$': Object,
    'accessories.$._id': String,
    'accessories.$.type': String,
    'accessories.$.description': String,
    'accessories.$.restitution': Number,
    'accessories.$.price': Number,
    'accessories.$.renting': SimpleSchema.Integer,

    services: Array,
    'services.$': Object,
    'services.$._id': String,
    'services.$.type': String,
    'services.$.description': String,
    'services.$.price': Number,
    'services.$.renting': SimpleSchema.Integer
  })
}))

Proposals.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('proposalsPub', (limit) => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('proposals')) return [];
    return Proposals.find({}, {
        sort: { _id: -1 },
        limit: limit || 0
      }
    );
  })

  Meteor.methods({
    'proposals.insert'(snapshot) {
      if (!Meteor.userId() || !tools.isWriteAllowed('proposals')) {
        throw new Meteor.Error('unauthorized');
      }
      const prefix = new Date().getFullYear();
      const suffix = Proposals.find({
        _id: { $regex: new RegExp(prefix)} }).count().toString().padStart(4, '0');
      var _id = prefix + "-" + suffix;

      var proposal = {
        _id,
        status: "inactive",
        snapshots: [snapshot],
        visible: true
      };
      Proposals.insert(proposal);
      Meteor.call('history.insert', proposal, 'proposals.insert');
      return proposal;
    },
    'proposals.update'(snapshot, _id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed('proposals')) {
        throw new Meteor.Error('unauthorized');
      }
      var oldProposal = Proposals.findOne({ _id });
      var hasChanged = !tools.compare(
        oldProposal.snapshots[index], snapshot
      );
      if (!hasChanged) {
        return {hasChanged: false};
      }
      var data = oldProposal;
      data.snapshots.push(snapshot)
      Proposals.update({ _id }, {$set: data})

      Meteor.call('history.insert', data, 'proposals.update');
      return {
        hasChanged: true,
        snapshot,
        index: oldProposal.snapshots.length
      };
    },
    'proposals.activate'(_id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed('proposals')) {
        throw new Meteor.Error('unauthorized');
      }
      var proposal = Proposals.findOne({ _id });
      var backupProposal = {...proposal};

      proposal.status = 'active';
      proposal.snapshots[index].active = true;

      Proposals.update({ _id }, {$set: proposal});
      Meteor.call('history.insert', { _id }, 'proposals.activate');

      try {
        var contractId = Meteor.call('contracts.insert', _id);
        return contractId;
      }
      catch(err) {
        Proposals.update({ _id }, backupProposal);
        throw err;
      }
    },
    'proposals.cancel'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('proposals')) {
        throw new Meteor.Error('unauthorized');
      }
      Proposals.update({ _id }, { $set: { status: "cancelled" } } );
      Meteor.call('history.insert', { _id }, 'proposals.cancel');
      return _id;
    }
  })
}