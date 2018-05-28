import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

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
  'users.insert'(userName, type) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const _id = Meteor.users.find().count().toString().padStart(4, '0');

    Accounts.createUser({email, password, profile}, (err) => {
      if (err) {
        this.setState({error: err.reason});
      } else {
        this.setState({error: ''});
      }
    });
  },

  'users.hide'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({ _id }, { $set: { visible: false } });
  },

  'users.update'(_id, userName, userTypeId, email, password) {

    const emailObj = {address: email, verified: false};
    const emailsArray = [emailObj];

    Meteor.users.update({ _id }, { $set: {
      userName,
      userTypeId,
      emails: emailsArray
      } });

      password ? Accounts.setPassword(_id, password) : null;

  }
})