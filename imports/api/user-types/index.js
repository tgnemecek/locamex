import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';

export const UserTypes = new Mongo.Collection('userTypes');

if(Meteor.isServer) {

    if (Meteor.isServer) {
      Meteor.publish('userTypesPub', () => {
        return UserTypes.find();
      })
    }
}

Meteor.methods({
  'userTypes.insert'(description, permissions) {
    const _id = tools.generateId(UserTypes);
    UserTypes.insert({
      _id,
      description,
      permissions,
      visible: true
    });
  },
  'userTypes.hide'(_id) {
     let conflicts = Meteor.users.find({ userTypeId: _id }).fetch();
     for (var i = 0; i < conflicts.length; i++) {
       Meteor.users.update({ _id: conflicts[i]._id }, { $set: {userTypeId: "0001"}});
     }
    UserTypes.update({ _id }, { $set: { visible: false } });
  },
  'userTypes.update'(_id, description, permissions) {
    UserTypes.update({ _id }, { $set: {
      description,
      permissions
      } });
  }
})
