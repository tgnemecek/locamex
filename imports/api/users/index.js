import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';
import tools from '/imports/startup/tools/index';

Meteor.users.attachSchema(new SimpleSchema({
  _id: String,
  username: String,
  emails: Array,
  'emails.$': Object,
  'emails.$.address': String,
  'emails.$.verified': Boolean,
  createdAt: Date,
  profile: Object,
  'profile.firstName': String,
  'profile.lastName': String,
  'profile.type': String,
  services: {
    type: Object,
    optional: true,
    blackbox: true
  }
}))

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('usersPub', function () {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('users')) return [];
    return Meteor.users.find({});
  });

  Meteor.methods({
    'users.test' () {
      var userId = Meteor.userId()
      Accounts.sendVerificationEmail(userId);
    },
    'users.insert'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('uers')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        username: state.username,
        password: state.password,
        email: state.email,
        profile: {
          firstName: state.profile.firstName,
          lastName: state.profile.lastName,
          type: state.profile.type
        }
      }
      var _id = Accounts.createUser(data);
      if (!_id) throw new Meteor.Error('user-not-created');

      
      return true;
    },
    // 'users.hide'(_id) {
    // if (!Meteor.userId() || !tools.isWriteAllowed('uers')) {
    //   throw new Meteor.Error('unauthorized');
    // }
    //   const data = {
    //     _id,
    //     visible: false
    //   }
    //   Meteor.users.update({ _id }, { $set: data });
    //   
    // },
    'users.update'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('uers')) {
        throw new Meteor.Error('unauthorized');
      }
      if (Meteor.user().profile.type !== 'administrator') {
        throw new Meteor.Error('unauthorized');
      }
      var _id = state._id;
      var data = {
        _id: state._id,
        username: state.username,
        email: state.email,
        profile: {
          firstName: state.profile.firstName,
          lastName: state.profile.lastName,
          type: state.profile.type
        }
      }
      Meteor.users.update({ _id }, { $set: data });
      
      return true;
    },
    'users.setPassword'(oldPassword, newPassword, userId) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      if (userId !== Meteor.userId()) {
        throw new Meteor.Error('unauthorized');
      }
      var res = Accounts._checkPassword(Meteor.user(), oldPassword)
      if (res.error) {
        console.log(res);
        throw res.error;
      } else {
        Accounts.setPassword(Meteor.userId(), newPassword, {
          logout: false
        });
        return true;
      }
    }
  })
}