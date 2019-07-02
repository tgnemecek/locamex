import { Mongo } from 'meteor/mongo';

export const Agenda = new Mongo.Collection('agenda');

if (Meteor.isServer) {
  Meteor.publish('agendaPub', () => {
    return Agenda.find({});
  })

  Meteor.methods({
    'agenda.insert' (data) {
      Agenda.insert({
        insertionDate: new Date(),
        insertedBy: Meteor.user()._id,
        visibleTo: data.visibleTo,
        type: data.type,
        date: data.date,
        repeat: data.repeat
      })
    }
  })
}