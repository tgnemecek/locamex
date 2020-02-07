import { Mongo } from 'meteor/mongo';
import { Series } from '/imports/api/series/index';
import tools from '/imports/startup/tools/index';
import updateReferences from '/imports/startup/update-references/index';

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
        visible: true
      }
      Places.insert(data);
      updateReferences(_id, 'places.insert', {
        _id,
        description
      });
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
      updateReferences(_id, 'places.update', {
        _id,
        description
      });
      Meteor.call('history.insert', data, 'places');
    }
  });
}