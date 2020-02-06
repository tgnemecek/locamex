import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import { Contracts } from '/imports/api/contracts/index';

import { userTypes } from '/imports/startup/user-types/index';

export const Agenda = new Mongo.Collection('agenda');

Agenda.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('agendaPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    var user = Meteor.user();
    if (user.type === "administrator") {
      return Agenda.find({});
    } else {
      var events = userTypes[user.type].events;
      return Agenda.find({ type: { $in: events } });
    }
  })

  Meteor.methods({
    'agenda.insert' (data) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      Agenda.insert({
        insertionDate: new Date(),
        insertedBy: Meteor.user()._id,
        type: data.type,
        date: data.date,
        referral: data.referral,
        description: data.description
      })
    }
  })
}