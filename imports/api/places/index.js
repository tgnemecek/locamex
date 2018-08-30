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
      description: "Antônio Pepe",
      visible: true
    })
    Places.insert({
      _id: "0001",
      description: "Pátio 2",
      visible: true
    })
    Places.insert({
      _id: "0002",
      description: "Outro Pátio",
      visible: true
    })
  }