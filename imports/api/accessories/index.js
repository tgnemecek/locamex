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
        snapshots: [],
        variations: state.variations,

        rented: 0,
        place: [],

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
        variations: state.variations,
        visible: true
      }
      Accessories.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories');
    },
    'accessories.stock.update'(item) {
      const data = {
        place: item.place
      }
      Accessories.update({ _id: item._id }, { $set: data });
      Meteor.call('history.insert', {...data, _id: item._id}, 'accessories.stock.update');
    },
    'accessories.stock.variations.update'(_id, variations) {
      const data = {
        variations
      }
      Accessories.update({ _id }, { $set: data });
      Meteor.call('history.insert', {...data, _id}, 'accessories.stock.variations.update');
    },
    'accessories.hide'(_id) {
      const data = {
        visible: false
      }
      Accessories.update({ _id: _id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories');
    }
  })
}