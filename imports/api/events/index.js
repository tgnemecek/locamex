import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import { Contracts } from '/imports/api/contracts/index';

import { userTypes } from '/imports/startup/user-types/index';

export const Events = new Mongo.Collection('events');

Events.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('eventsPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    var user = Meteor.user();
    if (user.profile.type === "administrator") {
      return Events.find({});
    } else {
      var events = userTypes[user.profile.type].events;
      return Events.find({ type: { $in: events } });
    }
  })

  Meteor.methods({
    'events.insert' (data) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      Events.insert({
        insertionDate: new Date(),
        insertedBy: Meteor.user(),
        type: data.type,
        date: data.date,
        referral: data.referral,
        description: data.description
      })
    }
  })
}