import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

var passwordMinLength = 6;
var userNameMinLength = 3;
var userNameMaxLength = 40;

if (Meteor.isServer) {
  Meteor.publish('usersPub', () => {
    return Meteor.users.find();
  })
}

Accounts.validateNewUser((user) => {
  const email = user.emails[0].address;

  new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validate({ email });

  return true;
});

Meteor.methods({
  'users.insert'(username, email, userTypeId, password) {

    if (!username || !email) {
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

    const _id = Accounts.createUser({username, email, password});

    if (!_id) {throw new Meteor.Error('user-not-created');}

    Meteor.users.update({ _id }, { $set: {
      username,
      userTypeId,
      visible: true
      } });
  },

  'users.hide'(_id) {
    Meteor.users.update({ _id }, { $set: { visible: false } });
  },

  'users.update'(_id, username, userTypeId, email, password) {

    if (!username || !email) {
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

    const emailObj = {address: email, verified: false};
    const emailsArray = [emailObj];

    Meteor.users.update({ _id }, { $set: {
      username,
      userTypeId,
      emails: emailsArray
      } });

      password ? Accounts.setPassword(_id, password) : null;

  }
})