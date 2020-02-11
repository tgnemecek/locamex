import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

export const Accounts = new Mongo.Collection('accounts');
export const accountsSchema = new SimpleSchema({
  _id: String,
  description: String,
  bank: String,
  bankNumber: String,
  number: String,
  branch: String,
  visible: {
    type: Boolean,
    optional: true
  }
});
Accounts.attachSchema(accountsSchema);

Accounts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('accountsPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('accounts')) return [];
    return Accounts.find({});
  })

  Meteor.methods({
    'accounts.insert' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accounts')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        _id: tools.generateId(),
        description: state.description,
        bank: state.bank,
        bankNumber: state.bankNumber,
        number: state.number,
        branch: state.branch,
        visible: true
      };
      Accounts.insert(data);
      Meteor.call('history.insert', data, 'accounts.insert');
      return true;
    },
    'accounts.update' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accounts')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        _id: state._id,
        description: state.description,
        bank: state.bank,
        bankNumber: state.bankNumber,
        number: state.number,
        branch: state.branch,
        visible: true
      };
      Accounts.update({_id: state._id}, {$set: data});
      Meteor.call('history.insert', data, 'accounts.update');
      return true;
    },
    'accounts.hide'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('accounts')) {
        throw new Meteor.Error('unauthorized');
      }
      const data = {
        _id,
        visible: false
      };
      Accounts.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'accounts.hide');
    }
  })
}