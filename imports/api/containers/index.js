import { Mongo } from 'meteor/mongo';
import { Series } from '/imports/api/series/index';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';
import updateReferences from './update-references';

export const Containers = new Mongo.Collection('containers');

Containers.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('containersPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Containers.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    // FIXED
    'containers.fixed.insert' (state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const _id = tools.generateId();
      var data = schema('containers', 'fullFixed').clean({
        _id,
        description: state.description,
        type: "fixed",

        price: state.price,
        restitution: state.restitution,
        flyer: false,

        visible: true
      })
      schema('containers', 'fullFixed').validate(data);
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.fixed.insert');
    },

    'containers.fixed.update' (state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var data = schema('containers', 'updateFixed').clean({
        description: state.description,
        price: state.price,
        restitution: state.restitution
      })
      schema('containers', 'updateFixed').validate(data);

      Containers.update({ _id: state._id }, { $set: data });
      updateReferences({...data, _id: state._id});
      Meteor.call('history.insert', { ...data, _id: state._id }, 'containers.fixed.update');
    },

    'containers.update.one' (_id, key, value) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var data = {
        _id,
        [key]: value
      }
      Containers.update({ _id }, {$set: {[key]: value}});
      Meteor.call('history.insert', data, 'containers.update.one');
    },

    // MODULAR
    'containers.modular.insert' (state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const _id = tools.generateId();
      var data = schema('containers', 'fullModular').clean({
        _id,
        description: state.description,
        type: "modular",

        allowedModules: state.allowedModules,

        price: state.price,
        restitution: state.restitution,
        flyer: false,

        visible: true
      })
      schema('containers', 'fullModular').validate(data);
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers.modular.insert');
    },

    'containers.modular.update' (state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var data = schema('containers', 'updateModular').clean({
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        allowedModules: state.allowedModules
      });
      schema('containers', 'updateModular').validate(data);
      Containers.update({ _id: state._id }, { $set: data });
      updateReferences({...data, _id: state._id});
      Meteor.call('history.insert', { ...data, _id: state._id }, 'containers.modular.update');
    },

    // OTHER
    'containers.update.flyer' (state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
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
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
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
}
