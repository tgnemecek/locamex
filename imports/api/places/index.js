import { Mongo } from 'meteor/mongo';
import { Series } from '/imports/api/series/index';
import tools from '/imports/startup/tools/index';

export const Places = new Mongo.Collection('places');

Places.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('placesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Places.find({ visible: true });
  })

  Meteor.methods({
    'places.insert'(description) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
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
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const data = {
        _id,
        visible: false
      };
      Places.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'places');
    },
    'places.update'(_id, description) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const data = {
        _id,
        description
      };
      Places.update({ _id }, { $set: {description} });
      Series.update(
        {placeId: _id},
        {$set: {placeDescription: description}},
        {multi: true}
      );
      Meteor.call('history.insert', data, 'places');
    }
  });
}