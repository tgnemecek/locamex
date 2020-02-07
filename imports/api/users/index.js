import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import schema from '/imports/startup/schema/index';
import tools from '/imports/startup/tools/index';

Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('usersPub', function () {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Meteor.users.find({});
  });

  Meteor.methods({
    'users.insert'(state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
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
      schema('users', 'update').validate(data);
      var _id = Accounts.createUser(data);
      if (!_id) {throw new Meteor.Error('user-not-created')}
      delete data.password;
      Meteor.call('history.insert', {...data, _id}, 'users.insert');
    },
    // 'users.hide'(_id) {
    //   if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    //   const data = {
    //     _id,
    //     visible: false
    //   }
    //   Meteor.users.update({ _id }, { $set: data });
    //   Meteor.call('history.insert', data, 'users');
    // },
    'users.update'(state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      if (!Meteor.user().profile.type !== 'administrator') {
        throw new Meteor.Error('unauthorized');
      }
      var _id = state._id;
      var data = {
        username: state.username,
        email: state.email,
        profile: {
          firstName: state.profile.firstName,
          lastName: state.profile.lastName,
          type: state.profile.type
        }
      }
      schema('users', 'update').validate(data);

      Meteor.users.update({ _id }, { $set: data });
      data._id = _id;
      Meteor.call('history.insert', data, 'users');
      return true;
    },
    'users.setPassword'(oldPassword, newPassword, userId) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      if (userId !== Meteor.userId()) {
        throw new Meteor.Error('unauthorized');
      }
      schema('users', 'password').validate({
        password: newPassword
      });
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