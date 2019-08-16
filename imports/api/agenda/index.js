import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import { Contracts } from '/imports/api/contracts/index';

import { userTypes } from '/imports/startup/user-types/index';

export const Agenda = new Mongo.Collection('agenda');

if (Meteor.isServer) {
  Meteor.publish('agendaPub', () => {
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
      Agenda.insert({
        insertionDate: new Date(),
        insertedBy: Meteor.user()._id,
        type: data.type,
        date: data.date,
        referral: data.referral,
        description: data.description
      })
    },
    'agenda.contract.activation'(_id) {
      var contract = Contracts.findOne({ _id });
      var snapshot = contract.snapshots[contract.activeVersion];
      // Adds events for billingProducts and billingServices
      snapshot.billingProducts.forEach((charge, i, arr) => {
        var data = {
          type: "billingProducts",
          date: charge.expiryDate,
          referral: _id,
          description: `${i+1}/${arr.length}`
        }
        Meteor.call('agenda.insert', data)
      })
      snapshot.billingServices.forEach((charge, i, arr) => {
        var data = {
          type: "billingServices",
          date: charge.expiryDate,
          referral: _id,
          description: `${i+1}/${arr.length}`
        }
        Meteor.call('agenda.insert', data)
      })
      // Adds event for deliveryDate
      Meteor.call('agenda.insert', {
        type: "deliveryDate",
        date: snapshot.dates.startDate,
        referral: _id,
        description: ""
      });
      //// Other idea, endDate:
      // var duration;
      // var endDate = moment(snapshot.dates.startDate);
      //
      // if (snapshot.dates.timeUnit === "months") {
      //   endDate = endDate.add((snapshot.dates.duration), 'months').toDate();
      // } else {
      //   endDate = endDate.add((snapshot.dates.duration), 'days').toDate();
      // }
      //
      // Meteor.call('agenda.insert', {
      //   type: "endDate",
      //   date: endDate,
      //   referral: _id,
      //   description: ""
      // })

      return contract;
    }
  })
}