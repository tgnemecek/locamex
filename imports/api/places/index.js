import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Places = new Mongo.Collection('places');

if(Meteor.isServer) {
    if (Meteor.isServer) {
      Meteor.publish('placesPub', () => {
        return Places.find();
      })
    }
    Places.remove({});
    Places.insert({
      _id: "0000",
      description: "Anônio Pepe",
      visible: true
    })
  }