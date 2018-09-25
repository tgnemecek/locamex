import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

var passwordMinLength = 4;
var userNameMinLength = 3;
var userNameMaxLength = 40;

if (Meteor.isServer) {
  Meteor.publish('usersPub', function () {
    return Meteor.users.find({ visible: true }, {sort: { username: 1 }});
    // if (this.userId) {
    //   return Meteor.users.find({}, {
    //     fields: { username: 1, visible: 1, pages: 1 }
    //   });
    // } else {
    //   this.ready();
    // }
  });

  Meteor.methods({
    'users.insert'(state) {
      var firstName = state.firstName;
      var lastName = state.lastName;
      var username = state.username;
      var password = state.password;
      var emails = [{address: state.emails, verified: false}];
      var pages = state.pages;
      if (!pages.includes('dashboard')) pages.unshift('dashboard');

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
        username,
        emails,
        pages,
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
      var emails = [{address: state.emails, verified: false}];
      var pages = state.pages;
      if (!pages.includes('dashboard')) pages.unshift('dashboard');

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
        username,
        emails,
        pages,
        visible: true
      }
      Meteor.users.update({ _id }, { $set: data });
      data._id = _id;
      Meteor.call('history.insert', data, 'users');
      password ? Accounts.setPassword(_id, password) : null;
    },
    'users.get.pages' (_id) {
      var user = Meteor.users.findOne({_id});
      return user.pages;
    }
  })
}