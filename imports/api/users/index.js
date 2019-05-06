import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

var passwordMinLength = 4;
var userNameMinLength = 3;
var userNameMaxLength = 40;

if (Meteor.isServer) {
  Meteor.publish('usersPub', function () {
    return Meteor.users.find(
      { visible: true },
      { fields: { type: 1, emails: 1, firstName: 1, lastName: 1 } },
      { sort: { username: 1 } }
    );
  });

  Meteor.methods({
    'users.insert'(state) {
      var firstName = state.firstName;
      var lastName = state.lastName;
      var username = state.username;
      var password = state.password;
      var type = state.type;
      var emails = [{address: state.emails, verified: false}];

      if (!username || !emails) {
        throw new Meteor.Error('required-fields-empty');
      };
      if (password.length < passwordMinLength) {
        throw new Meteor.Error('password-too-short');
      };
      if (username.length < userNameMinLength) {
        throw new Meteor.Error('name-too-short');
      };
      if (username.length > userNameMaxLength) {
        throw new Meteor.Error('name-too-long');
      };
      const _id = Accounts.createUser({username, emails, password});
      if (!_id) {throw new Meteor.Error('user-not-created');}
      const data = {
        _id,
        firstName,
        lastName,
        type,
        username,
        emails,
        visible: true
      };
      Meteor.users.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'users');
    },

    'users.hide'(_id) {
      const data = {
        _id,
        visible: false
      }
      Meteor.users.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'users');
    },

    'users.update'(state) {
      var _id = state._id;
      var firstName = state.firstName;
      var lastName = state.lastName;
      var username = state.username;
      var password = state.password;
      var type = state.type;
      var emails = [{address: state.emails, verified: false}];

      if (!username || !emails) {
        throw new Meteor.Error('required-fields-empty');
      };
      if (password && password.length < passwordMinLength) {
        throw new Meteor.Error('password-too-short');
      };
      if (username.length < userNameMinLength) {
        throw new Meteor.Error('name-too-short');
      };
      if (username.length > userNameMaxLength) {
        throw new Meteor.Error('name-too-long');
      };
      const data = {
        firstName,
        lastName,
        type,
        username,
        emails,
        visible: true
      }
      Meteor.users.update({ _id }, { $set: data });
      data._id = _id;
      Meteor.call('history.insert', data, 'users');
      password ? Accounts.setPassword(_id, password) : null;
    }
  })
}