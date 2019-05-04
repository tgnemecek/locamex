import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Places = new Mongo.Collection('places');

if (Meteor.isServer) {
  Meteor.publish('placesPub', () => {
    return Places.find({ visible: true });
  })

  Meteor.methods({
    'places.insert'(description) {
      const _id = tools.generateId();
      const data = {
        _id,
        description,
        items: [],
        visible: true
      }
      Places.insert(data);
      Meteor.call('history.insert', data, 'places');
    },
    'places.hide'(_id) {
      const data = {
        _id,
        visible: false
      };
      Places.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'places');
    },
    'places.update'(_id, description) {
      const data = {
        _id,
        description
      };
      Places.update({ _id }, { $set: {description} });
      Meteor.call('history.insert', data, 'places');
    }
  });
}