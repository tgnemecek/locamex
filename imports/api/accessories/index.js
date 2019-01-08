import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Accessories = new Mongo.Collection('accessories');

if (Meteor.isServer) {
  Meteor.publish('accessoriesPub', () => {
    return Accessories.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'accessories.insert'(state) {
      const _id = tools.generateId();
      const data = {
        _id,
        type: "accessory",
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,

        rented: 0,
        available: 0,
        maintenance: 0,
        inactive: 0,

        visible: true
      }
      Accessories.insert(data);
      Meteor.call('history.insert', data, 'accessories');
    },
    'accessories.update'(state) {
      const data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        visible: true
      }
      Accessories.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories');
    },
    'accessories.transaction'(state) {
      const data = {
        _id: state._id,
        available: state.available,
        maintenance: state.maintenance,
        inactive: state.inactive
      }
      Accessories.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories');
    },
    'accessories.hide'(_id) {
      const data = {
        visible: false
      }
      Accessories.update({ _id: _id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories');
    },
    'accessories.rent' (accessories) {
      var data = [];
      for (var i = 0; i < accessories.length; i++) {
        var changes = {
          available: -accessories[i].quantity,
          rented: accessories[i].quantity
        }
        Accessories.update({ _id: accessories[i]._id }, { $inc: changes });
        if (!data.includes(accessories[i])) data.push(accessories[i]);
        Meteor.call('history.insert', data, 'accessories');
      }
    },
    'accessories.receive' (accessories) {
      var data = [];
      for (var i = 0; i < accessories.length; i++) {
        if (accessories[i].quantity == 0) continue;
        var changes = {
          available: accessories[i].quantity,
          rented: -accessories[i].quantity
        }
        Accessories.update({ _id: accessories[i]._id }, { $inc: changes });
        if (!data.includes(accessories[i])) data.push(accessories[i]);
        Meteor.call('history.insert', data, 'accessories.receive');
      }
    },
    'accessories.check'(_id, quantity) {
      const item = Accessories.findOne(
        {
          $and: [
            { _id },
            { visible: true }
          ]
        }
      );
      if (!item) throw new Meteor.Error("_id-not-found", "Um dos acessórios locados não está mais disponível ou foi excluído.", arguments);
      if (item.available < quantity) {
        return false;
      } else return true;
    }
  })
}