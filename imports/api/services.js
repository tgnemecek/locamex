import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Services = new Mongo.Collection('services');

if (Meteor.isServer) {
  Meteor.publish('servicesPub', () => {
    return Services.find();
  })
}

Meteor.methods({
  'services.insert'(description, price) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const _id = Services.find().count().toString().padStart(4, '0');

    Services.insert({
      _id,
      description,
      price,
      visible: true
    });
  },
  'services.hide'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Services.update({ _id }, { $set: { visible: false } });
  },
  'services.update'(_id, description, price) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Services.update({ _id }, { $set: {
      description,
      price
      } });
  }
})