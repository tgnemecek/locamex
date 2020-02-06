import { Mongo } from 'meteor/mongo';

export const Accounts = new Mongo.Collection('accounts');

Accounts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('accountsPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Accounts.find({});
  })

  Meteor.methods({
    'accounts.insert' (state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var data = {
        description: state.description,
        bank: state.bank,
        bankNumber: state.bankNumber,
        number: state.number,
        branch: state.branch,
        visible: true
      };
      Accounts.insert(data);
      Meteor.call('history.insert', data, 'accounts.insert');
    },
    'accounts.update' (_id, state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var data = {
        description: state.description,
        bank: state.bank,
        bankNumber: state.bankNumber,
        number: state.number,
        branch: state.branch
      };
      Accounts.update({_id}, { $set: data });
      Meteor.call('history.insert', data, 'accounts.update');
    },
    'accounts.hide'(_id) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const data = {
        _id,
        visible: false
      };
      Accounts.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'accounts.hide');
    }
  })
}