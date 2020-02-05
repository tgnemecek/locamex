import { Mongo } from 'meteor/mongo';
import { Series } from '/imports/api/series/index';
import { Contracts } from '/imports/api/contracts/index';
import tools from '/imports/startup/tools/index';
import {
  insertFixedSchema,
  insertModularSchema,
  updateFixedSchema,
  updateModularSchema
} from './schemas';

export const Containers = new Mongo.Collection('containers');

Containers.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('containersPub', () => {
    return Containers.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    // FIXED
    'containers.fixed.insert' (state) {
      const _id = tools.generateId();
      var data = insertFixedSchema.clean({
        _id,
        description: state.description,
        type: "fixed",

        price: state.price,
        restitution: state.restitution,
        flyer: false,

        visible: true
      })
      insertFixedSchema.validate(data);
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.fixed.insert');
    },

    'containers.fixed.update' (state) {
      var data = updateFixedSchema.clean({
        description: state.description,
        price: state.price,
        restitution: state.restitution
      })
      updateFixedSchema.validate(data);

      Containers.update({ _id: state._id }, { $set: data });
      Series.update(
        {containerId: state._id},
        {$set: {containerDescription: state.description}},
        {multi: true}
      )
      // PAREI AQUI!!!!
      Contracts.update(
        {$and: [
          {status: "inactive"},
          {snapshots: {$elemMatch: {'containers._id': state._id}}}
        ]},
        {$set: {'snapshots.containers.containerDescription': state.description}},
        {multi: true, arrayFilters: [{"element._id": state._id]}
      )
      Meteor.call('history.insert', { ...data, _id: state._id }, 'containers.fixed.update');
    },

    'containers.update.one' (_id, key, value) {
      var data = {
        _id,
        [key]: value
      }
      Containers.update({ _id }, {$set: {[key]: value}});
      Meteor.call('history.insert', data, 'containers.update.one');
    },

    // MODULAR
    'containers.modular.insert' (state) {
      const _id = tools.generateId();
      var data = insertModularSchema.clean({
        _id,
        description: state.description,
        type: "modular",

        allowedModules: state.allowedModules,

        price: state.price,
        restitution: state.restitution,
        flyer: false,

        visible: true
      })
      insertModularSchema.validate(data);
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.modular.insert');
    },

    'containers.modular.update' (state) {
      var data = updateModularSchema.clean({
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        allowedModules: state.allowedModules
      });
      updateModularSchema.validate(data);
      Containers.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', { ...data, _id: state._id }, 'containers.modular.update');
    },

    // OTHER
    'containers.update.flyer' (state) {
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
    'a'(value) {
      return new Promise((resolve, reject) => {
        Meteor.call('b', value, (err, res) => {
          if (res) {
            resolve(res);
          }
        })
      });
    },
    'b'(value) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(value+2)
        }, 3000)
      })
    }
  })
}
