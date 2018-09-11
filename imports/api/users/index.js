import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

var passwordMinLength = 6;
var userNameMinLength = 3;
var userNameMaxLength = 40;

if (Meteor.isServer) {
  Meteor.publish('usersPub', () => {
    return Meteor.users.find();
  })

  Meteor.methods({
    'users.insert'(state) {
      var username = state.username;
      var password = state.password;
      var emails = [{address: state.emails, verified: false}];
      var pages = state.pages;

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
      var username = state.username;
      var password = state.password;
      var emails = [{address: state.emails, verified: false}];
      var pages = state.pages;

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
        pages,
        visible: true
      }
      Meteor.users.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'users');
      password ? Accounts.setPassword(_id, password) : null;

    }
  })
}
// if (Meteor.isClient) {
//   console.log('created');
//   Accounts.createUser({
//     username: "thiago",
//     email: "tgnemecek@gmail.com",
//     password: "1234",
//     pages: [],
//     visible: true
//   });
// }



// Accounts.validateNewUser((user) => {
//   const email = user.emails[0].address;
//
//   new SimpleSchema({
//     email: {
//       type: String,
//       regEx: SimpleSchema.RegEx.Email
//     }
//   }).validate({ email });
//
//   return true;
// });