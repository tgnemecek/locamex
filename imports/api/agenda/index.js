import { Mongo } from 'meteor/mongo';
import { Contracts } from '/imports/api/contracts/index';

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
        type: data.type,
        date: data.date,
        referral: data.referral,
        description: data.description
      })
    },
    'agenda.contract.activation'(_id) {
      var contract = Contracts.findOne({ _id });
      var snapshot = contract.snapshots[contract.activeVersion];
      snapshot.billingProducts.forEach((charge, i, arr) => {
        var data = {
          type: "billingProducts",
          date: charge.expiryDate,
          referral: _id,
          description: `${i+1}/${arr.length}`
          // description: `Contrato ${_id}: Parcela ${i+1}/${arr.length} de Locação.`
        }
        Meteor.call('agenda.insert', data)
      })
      snapshot.billingServices.forEach((charge, i, arr) => {
        var data = {
          type: "billingServices",
          date: charge.expiryDate,
          referral: _id,
          description: `${i+1}/${arr.length}`
          // description: `Contrato ${_id}: Parcela ${i+1}/${arr.length} de Locação.`
        }
        Meteor.call('agenda.insert', data)
      })
      return contract;
    }
  })
}