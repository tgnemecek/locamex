import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Services = new Mongo.Collection('services');

if (Services.find().count() === 0) {
  Services.insert({
    code: '001',
    description: "Serviço 1",
    price: 1200
  });
  Services.insert({
    code: '002',
    description: "Serviço 2",
    price: 3000
  });
  Services.insert({
    code: '003',
    description: "Serviço 3",
    price: 400
  });
  Services.insert({
    code: '004',
    description: "Serviço 4",
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