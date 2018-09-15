import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

var passwordMinLength = 4;
var userNameMinLength = 3;
var userNameMaxLength = 40;

if (Meteor.isServer) {
  Meteor.publish('usersPub', function () {
    if (this.userId) {
      return Meteor.users.find({ _id: this.userId }, {
        fields: { visible: 1 }
      });
    } else {
      this.ready();
    }
  });

  Meteor.methods({
    'users.insert'(state) {
      var username = state.username;
      var password = state.password;
      var emails = [{address: state.emails, verified: false}];
      var profile = {pages: state.pages}

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
        username,
        emails,
        profile,
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
      var username = state.username;
      var password = state.password;
      var emails = [{address: state.emails, verified: false}];
      var profile = {pages: state.pages}

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
        _id,
        username,
        emails,
        profile,
        visible: true
      }
      Meteor.users.update({ _id }, { $set: data });
      console.log(Meteor.userId());
      Meteor.call('history.insert', data, 'users');
      password ? Accounts.setPassword(_id, password) : null;
      console.log(Meteor.userId());
    }
  })
}