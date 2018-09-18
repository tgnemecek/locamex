import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Services = new Mongo.Collection('services');

if (Meteor.isServer) {
  Meteor.publish('servicesPub', () => {
    return Services.find({ visible: true }, {sort: { description: 1 }});
  })

  Meteor.methods({
    'services.insert'(description, price) {
      const _id = tools.generateId("services");
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
}