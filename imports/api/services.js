import {Mongo} from 'meteor/mongo';

export const Services = new Mongo.Collection('services');

if (Services.find().count() === 0) {
  Services.insert({
    description: "Novo Serviço 1",
    price: 10
  });
  Services.insert({
    description: "Novo Serviço 2",
    price: 20
  });
}