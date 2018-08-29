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
    Categories.insert({
      _id: "0000",
      description: "Cadeira",
      visible: true
    })
    Categories.insert({
      _id: "0001",
      description: "Porta",
      visible: true
    })
    Categories.insert({
      _id: "0002",
      description: "Ar Condicionado",
      visible: true
    })
    Categories.insert({
      _id: "0003",
      description: "Frigobar",
      visible: true
    })
  }