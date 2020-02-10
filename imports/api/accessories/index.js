import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Places } from '/imports/api/places/index';
import { Proposals } from '/imports/api/proposals/index';
import { Contracts } from '/imports/api/contracts/index';
import tools from '/imports/startup/tools/index';

export const Accessories = new Mongo.Collection('accessories');
export const accessoriesSchema = new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  price: Number,
  restitution: Number,
  renting : {
    type: SimpleSchema.Integer,
    optional: true
  },
  observations: {
    type: String,
    optional: true
  },
  variations: Array,
  'variations.$': Object,
  'variations.$._id': String,
  'variations.$.description': String,
  'variations.$.observations': {
    type: String,
    optional: true
  },
  'variations.$.rented': SimpleSchema.Integer,
  'variations.$.places': Array,
  'variations.$.places.$': Object,
  'variations.$.places.$._id': String,
  'variations.$.places.$.description': String,
  'variations.$.places.$.available': SimpleSchema.Integer,
  'variations.$.places.$.inactive': SimpleSchema.Integer,
  'variations.$.visible': Boolean,
  images: Array,
  'images.$': String,
  'visible': Boolean
})
Accessories.attachSchema(accessoriesSchema);

Accessories.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {

  Meteor.publish('accessoriesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('accessories')) return [];
    return Accessories.find({ visible: true }, {sort: { description: 1 }});
  })

  Meteor.methods({
    'accessories.insert'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      var places = Places.find().fetch();
      const _id = tools.generateId();
      var data = {
        _id,
        type: "accessory",
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        images: [],
        variations: state.variations,
        visible: true
      }
      Accessories.insert(data);
      Meteor.call('history.insert', data, 'accessories.insert');
      return true;
    },
    'accessories.update'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        variations: state.variations
      }
      Accessories.update({ _id: state._id }, {$set: data});
      updateReferences(state._id, {
        description: data.description,
        restitution: data.restitution,
        observations: data.observations,
        variations: data.variations
      })
      Meteor.call('history.insert', data, 'accessories.update');
      return true;
    },
    'accessories.update.images'(_id, images) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      Accessories.update({ _id }, { $set: {images} });
      updateReferences(_id, {images});
      Meteor.call('history.insert', {_id, images}, 'accessories.update.images');
      return _id;
    },
    'accessories.update.stock'(_id, variations) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      Accessories.update({ _id },
        { $set: {variations} });
      updateReferences(_id, {variations});
      Meteor.call('history.insert', {variations, _id}, 'accessories.update.stock');
      return true;
    },
    'accessories.shipping.send'(product) { // SimpleSchema not applied
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      var _id = product._id;
      delete product._id;
      Accessories.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'accessories.shipping.send');
    },
    'accessories.shipping.receive'(product) { // SimpleSchema not applied
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      var _id = product._id;
      delete product._id;
      Accessories.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'accessories.shipping.receive');
    },
    'accessories.hide'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      var visible = false;
      Accessories.update({ _id }, { $set: {visible} });
      Meteor.call('history.insert', data, 'accessories.hide');
      return true;
    }
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