import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Services = new Mongo.Collection('services');

if (Meteor.isServer) {
  Meteor.publish('servicesPub', () => {
    return Services.find();
  })
}

if (Services.find().count() === 0) {
  Services.insert({
    code: '001',
    description: "Serviço A",
    price: 1200
  });
  Services.insert({
    code: '002',
    description: "Serviço B",
    price: 3000
  });
  Services.insert({
    code: '003',
    description: "Serviço C",
    price: 400
  });
  Services.insert({
    code: '004',
    description: "Serviço D",
    price: 2000
  });
}

Meteor.methods({
  'services.remove'(_id) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Services.remove({ _id });
  }
})