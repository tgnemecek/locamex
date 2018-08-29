import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Accessories = new Mongo.Collection('accessories');

if(Meteor.isServer) {
    if (Meteor.isServer) {
      Meteor.publish('accessoriesPub', () => {
        return Accessories.find();
      })
    }
    Accessories.remove({});
    Accessories.insert({
      _id: "0000",
      description: "Cadeira Tipo A",
      category: "0000",
      place: "0001",
      available: 100,
      rented: 50,
      maintenance: 10,
      price: 100,
      restitution: 600,
      observations: '',
      visible: true
    })
    Accessories.insert({
      _id: "0001",
      description: "Cadeira Tipo B",
      category: "0000",
      place: "0001",
      available: 100,
      rented: 50,
      maintenance: 10,
      price: 100,
      restitution: 600,
      observations: '',
      visible: true
    })
  }