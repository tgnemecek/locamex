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
    const data = {
      _id,
      description,
      price,
      visible: true
    }
    Services.insert(data);
    Meteor.call('history.insert', data, 'services');
  },
  'services.hide'(_id) {
    const data = {
      _id,
      visible: false
    };
    Services.update({ _id }, { $set: data });
    Meteor.call('history.insert', data, 'services');
  },

  'services.update'(_id, description, price) {
    const data = {
      _id,
      description,
      price
    };
    Services.update({ _id }, { $set: data });
    Meteor.call('history.insert', data, 'services');
  }
})