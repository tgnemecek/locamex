import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Containers = new Mongo.Collection('containers');

if (Meteor.isServer) {
  Meteor.publish('containersPub', () => {
    return Containers.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'containers.insert'(state) {
      const _id = tools.generateId();
      var data;
      if (state.type == 'fixed') {
        data = {
          _id,
          description: state.description,
          type: state.type,
          serial: state.serial,
          status: "available",
          price: state.price || 0,
          restitution: state.restitution || 0,
          observations: state.observations,
          images: state.images,
          visible: true
        }
      } else if (state.type == 'modular') {
        data = {
          _id,
          description: state.description,
          type: state.type,
          assembled: state.assembled || 0,
          place: undefined,
          price: state.price || 0,
          restitution: state.restitution || 0,
          modules: state.modules || [],
          visible: true
        };
      }
      Containers.insert(data);
      Meteor.call('history.insert', data, 'containers');
    }, // Marked (currently being used)
    'containers.update'(state) {
      var data;
      if (state.type == 'fixed') {
        data = {
          description: state.description,
          type: state.type,
          serial: state.serial,
          price: state.price,
          restitution: state.restitution,
          observations: state.observations,
          images: state.images,
          visible: true
        };
      } else if (state.type == 'modular') {
        data = {
          description: state.description,
          type: state.type,
          assembled: state.assembled,
          price: state.price,
          restitution: state.restitution,
          modules: state.modules,
          visible: true
        };
      }
      Containers.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'containers');
    }, // Marked (currently being used)
    'containers.hide'(_id) {
      const data = {
        visible: false
      };
      Containers.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'containers');
    }, // Marked (currently being used)
    'containers.transaction.fixed'(state) {
      const data = {
        _id: state._id,
        status: state.status,
        place: state.place
      }
      Containers.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'containers');
    }, // Marked (currently being used)
    'containers.status' (_id, status) {
      var data = {
        status
      }
      Containers.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'containers');
    }, // Unmarked (needs to be checked)
    'containers.check'(_id) {
      const item = Containers.findOne(
        {
          $and: [
            { _id },
            { visible: true }
          ]
        }
      );
      if (!item) throw new Meteor.Error("_id-not-found", "Um dos containers locados não está mais disponível ou foi excluído.", arguments);
      if (item.status == 'available') {
        return true;
      } else return false;
    }, // Unmarked (needs to be checked)
    'containers.update.assembled'(_id, quantity) {
      var data = {
        assembled: quantity
      };
      Containers.update({ _id }, { $inc: data });
      data._id = _id;
      Meteor.call('history.insert', data, 'containers.update.assembled');
    } // Unmarked (needs to be checked)
  })
}
