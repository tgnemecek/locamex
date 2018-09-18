import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Categories = new Mongo.Collection('categories');

if(Meteor.isServer) {
    if (Meteor.isServer) {
      Meteor.publish('categoriesPub', () => {
        return Categories.find();
      })
    }
    Categories.remove({});
  }