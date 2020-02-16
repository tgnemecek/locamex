import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Places } from '/imports/api/places/index';
import { Proposals } from '/imports/api/proposals/index';
import { Contracts } from '/imports/api/contracts/index';
import tools from '/imports/startup/tools/index';

export const Accessories = new Mongo.Collection('accessories');
Accessories.attachSchema(new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  price: Number,
  restitution: Number,
  available: SimpleSchema.Integer,
  inactive: SimpleSchema.Integer,
  rented: SimpleSchema.Integer,
  'visible': Boolean
}));

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
      const _id = tools.generateId();
      var data = {
        _id,
        type: "accessory",
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        available: 0,
        inactive: 0,
        rented: 0,
        visible: true
      }
      Meteor.call('variations.update', {...state, _id});
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
        restitution: state.restitution
      }
      Meteor.call('variations.update', state);
      Accessories.update({ _id: state._id }, {$set: data});
      Meteor.call('history.insert', data, 'accessories.update');
      return true;
    },
    'accessories.update.stock'(variations) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
        throw new Meteor.Error('unauthorized');
      }
      var available = 0;
      var inactive = 0;

      variations.forEach((variation) => {
        variation.places.forEach((place) => {
          available += place.available;
          inactive += place.inactive;
        })
      })
      var accessoryId = variations[0].accessory._id;
      Accessories.update({_id: accessoryId}, {$set: {
        available,
        inactive
      }});
      // Meteor.call('history.insert', {variations, _id}, 'accessories.update.stock');
      return true;
    },
    // 'accessories.update.images'(_id, images) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   Accessories.update({ _id }, { $set: {images} });
    //   updateReferences(_id, {images});
    //   Meteor.call('history.insert', {_id, images}, 'accessories.update.images');
    //   return _id;
    // },
    // 'accessories.shipping.send'(product) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   var _id = product._id;
    //   delete product._id;
    //   Accessories.update({ _id }, product);
    //   Meteor.call('history.insert', {product, _id}, 'accessories.shipping.send');
    // },
    // 'accessories.shipping.receive'(product) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   var _id = product._id;
    //   delete product._id;
    //   Accessories.update({ _id }, product);
    //   Meteor.call('history.insert', {product, _id}, 'accessories.shipping.receive');
    // },
    // 'accessories.hide'(_id) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   var visible = false;
    //   Accessories.update({ _id }, { $set: {visible} });
    //   Meteor.call('history.insert', data, 'accessories.hide');
    //   return true;
    // }
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