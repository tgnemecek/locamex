import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Containers = new Mongo.Collection('containers');

if (Meteor.isServer) {
  Meteor.publish('containersPub', () => {
    return Containers.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    // FIXED
    'containers.fixed.insert' (state) {
      const _id = tools.generateId();
      var data = {
        _id,
        description: state.description,
        type: "fixed",

        units: [],

        price: state.price,
        restitution: state.restitution,

        visible: true
      }
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.fixed.insert');
    },

    'containers.fixed.update' (state) {
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution
      };

      Containers.update({ _id: state._id }, { $set: data });
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
      var data = {
        _id,
        description: state.description,
        type: "modular",

        allowedModules: state.allowedModules,

        price: state.price,
        restitution: state.restitution,

        visible: true
      };
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.modular.insert');
    },

    'containers.modular.update' (state) {
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        allowedModules: state.allowedModules
      };
      Containers.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', { ...data, _id: state._id }, 'containers.modular.update');
    },

    // OTHER
    'containers.update.flyer' (state) {
      var paragraphs = state.hasFlyer ? state.paragraphs : [];
      var images = state.hasFlyer ? state.images : [];
      var container = Containers.findOne({ _id: state._id });
      
    }
  })
}
