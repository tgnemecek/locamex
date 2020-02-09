import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Series } from '/imports/api/series/index';
import { modulesSchema } from '/imports/api/modules/index';
import tools from '/imports/startup/tools/index';

export const Containers = new Mongo.Collection('containers');
export const containersSchema = new SimpleSchema({
  _id: String,
  description: String,
  type: String,
  price: Number,
  restitution: Number,
  flyer: {
    type: String,
    optional: true
  },
  allowedModules: {
    type: Array,
    optional: true
  },
  'allowedModules.$': modulesSchema,
  visible: Boolean
})
Containers.attachSchema(containersSchema);

Containers.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('containersPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('containers')) return [];
    return Containers.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    // FIXED
    'containers.fixed.insert' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      const _id = tools.generateId();
      var data = {
        _id,
        description: state.description,
        type: "fixed",
        price: state.price,
        restitution: state.restitution,
        flyer: false,
        visible: true
      }
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.fixed.insert');
      return true;
    },

    'containers.fixed.update' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution
      }

      Containers.update({ _id: state._id }, { $set: data });
      updateReferences(state._id, {
        description: state.description,
        restitution: state.restitution
      })
      Meteor.call('history.insert', { ...data, _id: state._id }, 'containers.fixed.update');
      return true;
    },

    'containers.update.one' (_id, key, value) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        _id,
        [key]: value
      }
      Containers.update({ _id }, {$set: {[key]: value}});
      Meteor.call('history.insert', data, 'containers.update.one');
      return true;
    },

    // MODULAR
    'containers.modular.insert' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      const _id = tools.generateId();
      var data = {
        _id,
        description: state.description,
        type: "modular",

        allowedModules: state.allowedModules,

        price: state.price,
        restitution: state.restitution,
        flyer: false,

        visible: true
      }
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.modular.insert');
      return true;
    },

    'containers.modular.update' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        allowedModules: state.allowedModules
      }
      Containers.update({ _id: state._id }, { $set: data });
      // updateReferences(state._id, 'containers', {
      //   ...data,
      //   price: undefined
      // });
      Meteor.call('history.insert', { ...data, _id: state._id }, 'containers.modular.update');
      return true;
    },

    // OTHER
    'containers.update.flyer' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      var flyer = {};
      flyer.paragraphs = state.hasFlyer ? state.paragraphs : [];
      if (!state.hasFlyer) {
        flyer.paragraphs = [];
        flyer.images = [];
      } else {
        flyer.paragraphs = state.paragraphs;
        if (state.newImages) {
          flyer.images = state.images;
        } else {
          var item = Containers.findOne({ _id: state._id });
          flyer.images = item.flyer.images;
        }
      }

      Containers.update({ _id: state._id }, {$set: { flyer }})
      Meteor.call('history.insert', flyer, 'containers.update.flyer');
      return state._id;
    },
    'containers.delete.flyer.images' (_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      return new Promise((resolve, reject) => {
        var item = Containers.findOne({ _id });
        if (!item.flyer) resolve(_id);

        Meteor.call('aws.delete.objects', item.flyer.images,
        (err, res) => {
          if (err) console.log(err);
          if (res) {
            Meteor.call('history.insert', item.flyer, 'containers.delete.flyer.images');
            resolve(_id);
          }
        })
      })
    },
  })

  function updateReferences(_id, changes) {
    Proposals.find({status: "inactive"})
    .forEach((proposal) => {
        proposal.snapshots.forEach((snapshot) => {
          snapshot.accessories = snapshot.accessories
          .map((item) => {
            if (item._id === _id) {
              return {
                ...item,
                ...changes
              }
            } else return item;
          })
        })
        Proposals.update({ _id: proposal._id },
          {$set: proposal});
    })
    Contracts.find({status: "inactive"})
    .forEach((contract) => {
        contract.snapshots.forEach((snapshot) => {
          snapshot.accessories = snapshot.accessories
          .map((item) => {
            if (item._id === _id) {
              return {
                ...item,
                ...changes
              }
            } else return item;
          })
        })
        Contracts.update({ _id: contract._id },
          {$set: contract});
    })
  }
}
