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

    'containers.fixed.update.one' (_id, value, key) {
      var data = {
        _id,
        [key]: value
      }
      Containers.update({_id}, {$set: {[key]: value}});
      Meteor.call('history.insert', data, 'containers.fixed.update.one');
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
    }

    // 'containers.insert'(state) {
    //   const _id = tools.generateId();
    //   var data;
    //   if (state.type == 'fixed') {
    //     data = {
    //       _id,
    //       description: state.description,
    //       type: state.type,
    //       available: [],
    //       rented: [],
    //       serial: state.serial,
    //       status: "available",
    //       price: state.price || 0,
    //       restitution: state.restitution || 0,
    //       observations: state.observations,
    //       images: state.images,
    //       visible: true
    //     }
    //   } else if (state.type == 'modular') {
    //     data = {
    //       _id,
    //       description: state.description,
    //       type: state.type,
    //       assembled: state.assembled || 0,
    //       place: undefined,
    //       price: state.price || 0,
    //       restitution: state.restitution || 0,
    //       allowedModules: state.allowedModules || [],
    //       visible: true
    //     };
    //   }
    //   Containers.insert(data);
    //   Meteor.call('history.insert', data, 'containers');
    // }, // Marked (currently being used)
    // 'containers.update'(state) {
    //   var data;
    //   if (state.type == 'fixed') {
    //     data = {
    //       description: state.description,
    //       type: state.type,
    //       serial: state.serial,
    //       price: state.price,
    //       restitution: state.restitution,
    //       observations: state.observations,
    //       images: state.images,
    //       visible: true
    //     };
    //   } else if (state.type == 'modular') {
    //     data = {
    //       description: state.description,
    //       type: state.type,
    //       assembled: state.assembled,
    //       price: state.price,
    //       restitution: state.restitution,
    //       allowedModules: state.allowedModules,
    //       visible: true
    //     };
    //   }
    //   Containers.update({ _id: state._id }, { $set: data });
    //   Meteor.call('history.insert', data, 'containers');
    // }, // Marked (currently being used)
    // 'containers.hide'(_id) {
    //   const data = {
    //     visible: false
    //   };
    //   Containers.update({ _id }, { $set: data });
    //   Meteor.call('history.insert', data, 'containers');
    // }, // Marked (currently being used)
    // 'containers.transaction.fixed'(state) {
    //   const data = {
    //     _id: state._id,
    //     status: state.status,
    //     place: state.place
    //   }
    //   Containers.update({ _id: state._id }, { $set: data });
    //   Meteor.call('history.insert', data, 'containers');
    // }, // Marked (currently being used)
    // 'containers.status' (_id, status) {
    //   var data = {
    //     status
    //   }
    //   Containers.update({ _id }, { $set: data });
    //   Meteor.call('history.insert', data, 'containers');
    // }, // Unmarked (needs to be checked)
    // 'containers.check'(_id) {
    //   const item = Containers.findOne(
    //     {
    //       $and: [
    //         { _id },
    //         { visible: true }
    //       ]
    //     }
    //   );
    //   if (!item) throw new Meteor.Error("_id-not-found", "Um dos containers locados não está mais disponível ou foi excluído.", arguments);
    //   if (item.status == 'available') {
    //     return true;
    //   } else return false;
    // }, // Unmarked (needs to be checked)
    // 'containers.update.assembled'(_id, quantity) {
      // var data = {
      //   assembled: quantity
      // };
      // Containers.update({ _id }, { $inc: data });
      // data._id = _id;
      // Meteor.call('history.insert', data, 'containers.update.assembled');
    // } // Unmarked (needs to be checked)
  })
}
