import { Mongo } from 'meteor/mongo';
import { version } from '/package.json';

export const History = new Mongo.Collection('history');

if (Meteor.isServer) {
  Meteor.publish('historyPub', () => {
    return History.find({}, {sort: { insertionDate: -1 }});
  })

  Meteor.methods({
    'history.insert' (data, type) {
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