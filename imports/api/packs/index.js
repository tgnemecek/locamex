import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Packs = new Mongo.Collection('packs');

if(Meteor.isServer) {

  Meteor.publish('packsPub', () => {
    return Packs.find();
  })

  Packs.remove({});

  Packs.insert({
    _id: "0000",
    containerId: "0000",
    price: "",
    modules: [{_id: "0000", quantity: 5}],
    quantity: 2
  });
}