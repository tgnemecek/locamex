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
    'accessories.update.one'(_id, key, value) {
      Accessories.update({ _id }, { $set: {[key]: value} });
      Meteor.call('history.insert', {_id, key, value}, 'accessories.update.one');
      return _id;
    },
    'accessories.stock.variations.update'(_id, variations) {
      const data = {
        variations
      }
      Accessories.update({ _id }, { $set: data });
      Meteor.call('history.insert', {...data, _id}, 'accessories.stock.variations.update');
    },
    'accessories.shipping.send'(product) {
      var _id = product._id;
      delete product._id;
      Accessories.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'accessories.shipping.send');
    },
    'accessories.shipping.receive'(product) {
      var _id = product._id;
      delete product._id;
      Accessories.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'accessories.shipping.receive');
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