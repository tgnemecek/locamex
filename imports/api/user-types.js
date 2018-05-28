import { Mongo } from 'meteor/mongo';

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
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const _id = UserTypes.find().count().toString().padStart(4, '0');

    UserTypes.insert({
      _id,
      description,
      permissions,
      visible: true
    });
  },
  'userTypes.hide'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    UserTypes.update({ _id }, { $set: { visible: false } });
  },
  'userTypes.update'(_id, description, permissions) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    UserTypes.update({ _id }, { $set: {
      description,
      permissions
      } });
  }
})
