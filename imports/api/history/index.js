import { Mongo } from 'meteor/mongo';
import { version } from '/package.json';
import tools from '/imports/startup/tools/index';

export const History = new Mongo.Collection('history');

History.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('historyPub', (limit) => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('history')) return [];
    return History.find({}, {
      sort: { insertionDate: -1 },
      limit: limit || 0
    });
  })

  Meteor.methods({
    'history.insert' (data, type) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      History.insert({
        insertionDate: new Date(),
        user: Meteor.user(),
        type,
        data,
        version
      })
    }
  })
}