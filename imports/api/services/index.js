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
    const _id = tools.generateId(Services);
    Services.insert({
      _id,
      description,
      price,
      visible: true
    });
  },

  'services.hide'(_id) {
    Services.update({ _id }, { $set: { visible: false } });
  },

  'services.update'(_id, description, price) {
    Services.update({ _id }, { $set: {
      description,
      price
      }});
  }
})