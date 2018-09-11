import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Places = new Mongo.Collection('places');

if (Meteor.isServer) {
  Meteor.publish('placesPub', () => {
    return Places.find();
  })
    Places.remove({});
    Places.insert({
      _id: "0000",
      description: "Monsenhor Antônio Pepe 52",
      visible: true
    })
    Places.insert({
      _id: "0001",
      description: "Monsenhor Antônio Pepe 123",
      visible: true
    })
    Places.insert({
      _id: "0002",
      description: "Lacedemônia",
      visible: true
    })
    Places.insert({
      _id: "0003",
      description: "Carmen Miranda",
      visible: true
    })
    Places.insert({
      _id: "0004",
      description: "Fernando Pessoa (Galpão)",
      visible: true
    })
    Places.insert({
      _id: "0005",
      description: "Fernando Pessoa (Terreno)",
      visible: true
    })
    Places.insert({
      _id: "0006",
      description: "Niterói",
      visible: true
    })
    Places.insert({
      _id: "0007",
      description: "Paulínia",
      visible: true
    })
    Places.insert({
      _id: "0008",
      description: "Fábrica",
      visible: true
    })
  }