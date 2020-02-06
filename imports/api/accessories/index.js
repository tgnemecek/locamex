import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';

export const Accessories = new Mongo.Collection('accessories');

Accessories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('accessoriesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Accessories.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'accessories.insert'(state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const _id = tools.generateId();
      var data = schema('accessories', 'full').clean({
        _id,
        type: "accessory",
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        images: [],
        variations: state.variations,
        visible: true
      })
      schema('accessories', 'full').validate(data);
      Accessories.insert(data);
      Meteor.call('history.insert', data, 'accessories.insert');
    },
    'accessories.update'(state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var data = schema('accessories', 'update').clean({
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        variations: state.variations
      })
      console.log(data);
      schema('accessories', 'update').validate(data);
      Accessories.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'accessories.update');
    },
    'accessories.update.images'(_id, images) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      try {
        imagesSchema.validate({images});
        Accessories.update({ _id }, { $set: { images } });
        Meteor.call('history.insert', {_id, images}, 'accessories.update.images');
        return _id;
      }
      catch(err) {
        console.log(err);
        throw new Meteor.Error(err);
      }
    },
    'accessories.update.stock'(_id, variations) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      try {
        var data = stockSchema.clean({
          variations
        })
        stockSchema.validate(data);
        Accessories.update({ _id }, { $set: data });
        Meteor.call('history.insert', {...data, _id}, 'accessories.update.stock');
      }
      catch(err) {
        console.log(err);
        throw new Meteor.Error(err);
      }
    },
    'accessories.shipping.send'(product) { // SimpleSchema not applied
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var _id = product._id;
      delete product._id;
      Accessories.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'accessories.shipping.send');
    },
    'accessories.shipping.receive'(product) { // SimpleSchema not applied
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var _id = product._id;
      delete product._id;
      Accessories.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'accessories.shipping.receive');
    },
    'accessories.hide'(_id) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      try {
        var data = {
          visible: false
        }
        hideSchema.validate(data);
        Accessories.update({ _id: _id }, { $set: data });
        Meteor.call('history.insert', data, 'accessories.hide');
      }
      catch(err) {
        console.log(err);
        throw new Meteor.Error(err);
      }
    }
  })
}