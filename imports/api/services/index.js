import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Proposals } from '/imports/api/proposals/index';
import { Contracts } from '/imports/api/contracts/index';
import tools from '/imports/startup/tools/index';

export const Services = new Mongo.Collection('services');
export const servicesSchema = new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  price: Number,
  visible: Boolean
})
Services.attachSchema(servicesSchema);

Services.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('servicesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('services')) return [];
    return Services.find({ visible: true }, {sort: { description: 1 }});
  })

  Meteor.methods({
    'services.insert'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('services')) {
        throw new Meteor.Error('unauthorized');
      }
      const _id = tools.generateId();
      var data = {
        _id,
        description: state.description,
        price: state.price,
        type: "service",
        visible: true
      }
      Services.insert(data);

      return true;
    },
    'services.update'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('services')) {
        throw new Meteor.Error('unauthorized');
      }
      const data = {
        _id: state._id,
        description: state.description,
        price: state.price
      }
      // Updating References:
      var changes = {
        description: data.description
      }
      Proposals.find({status: "inactive"})
      .forEach((proposal) => {
          proposal.snapshots.forEach((snapshot) => {
            snapshot.services = snapshot.services
            .map((item) => {
              if (item._id === state._id) {
                return {
                  ...item,
                  ...changes
                }
              } else return item;
            })
          })
          Proposals.update({ _id: proposal._id },
            {$set: proposal});
      })
      Contracts.find({status: "inactive"})
      .forEach((contract) => {
          contract.snapshots.forEach((snapshot) => {
            snapshot.services = snapshot.services
            .map((item) => {
              if (item._id === state._id) {
                return {
                  ...item,
                  ...changes
                }
              } else return item;
            })
          })
          Contracts.update({ _id: contract._id },
            {$set: contract});
      })

      Services.update({ _id: state._id }, { $set: data });
      return true;
    },
    'services.hide'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('services')) {
        throw new Meteor.Error('unauthorized');
      }
      Services.update({ _id }, { $set: {visible: false} });
      return true;
    },
  })
}