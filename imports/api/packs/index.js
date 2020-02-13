import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Modules } from '/imports/api/modules/index';
import tools from '/imports/startup/tools/index';

export const Packs = new Mongo.Collection('packs');
Packs.attachSchema(new SimpleSchema({
  _id: String,
  description: String,
  type: String,
  rented: Boolean,
  observations: {
    type: String,
    optional: true
  },
  place: Object,
  'place._id': {
    type: String,
    optional: true
  },
  'place.description': {
    type: String,
    optional: true
  },
  container: Object,
  'container._id': String,
  'container.description': String,
  modules: Array,
  'modules.$': Object,
  'modules.$._id': String,
  'modules.$.description': String,
  'modules.$.renting': SimpleSchema.Integer,
  'modules.$.type': String
}))

Packs.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('packsPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('packs')) return [];
    return Packs.find({}, {sort: { description: 1 }});
  })
  Meteor.methods({
    // 'packs.insert' (pack) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('packs')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //
    // },
    'packs.update'(_id, data) {
      if (!Meteor.userId() || !tools.isWriteAllowed('packs')) {
        throw new Meteor.Error('unauthorized');
      }
      Packs.update({ _id }, { $set: data });
      Meteor.call('history.insert', {data}, 'packs.update');
      return true;
    },
    // 'packs.check'(_id) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('packs')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   const item = Packs.findOne(
    //     {
    //       $and: [
    //         { _id },
    //         { visible: true }
    //       ]
    //     }
    //   );
    //   if (!item) throw new Meteor.Error("_id-not-found", "Um dos pacotes locados não está mais disponível ou foi excluído.", arguments);
    //   if (item.status == 'available') {
    //     return true;
    //   } else return false;
    // },
    // 'packs.rent' (_id) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('packs')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   Packs.remove({ _id });
    //   Meteor.call('history.insert', _id, 'packs.rent');
    // },
    'packs.unmount' (_id, place) {
      if (!Meteor.userId() || !tools.isWriteAllowed('packs')) {
        throw new Meteor.Error('unauthorized');
      }

      var pack = Packs.findOne({_id});

      pack.modules.forEach((module) => {
        var newModule = Modules.findOne({_id: module._id});
        var placeExists = newModule.places.find((item) => {
          return item._id === place._id;
        })
        if (placeExists) {
          placeExists.available += module.renting;
        } else {
          newModule.places.push({
            ...place,
            available: module.renting,
            inactive: 0
          })
        }
        Modules.update({_id: module._id}, {$set: newModule});
      })
      Packs.remove({_id});
      return true;

      // Packs.update({ _id }, { $set: data });
      // Meteor.call('modules.receive', pack.modules);
      // Meteor.call('containers.update.assembled', pack.containerId, -1);
      // Meteor.call('history.insert', data, 'packs.unmount');
    }
  })
}