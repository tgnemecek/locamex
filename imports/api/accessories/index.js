import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Accessories = new Mongo.Collection('accessories');

if (Meteor.isServer) {
  Meteor.publish('accessoriesPub', () => {
    return Accessories.find();
  })
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
Meteor.methods({
  'accessories.insert'(state) {
    const _id = tools.generateId(Accessories);
    const data = {
      _id,
      description: state.description,
      category: state.category,
      place: state.place,
      available: state.available,
      rented: state.rented,
      maintenance: state.maintenance,
      price: state.price,
      restitution: state.restitution,
      observations: state.observations,
      visible: true
    }
    Accessories.insert(data);
    Meteor.call('history.insert', data, 'accessories');
  },
  'accessories.hide'(_id) {
    const data = {
      visible: false
    }
    Accessories.update({ _id: _id }, { $set: data });
    Meteor.call('history.insert', data, 'accessories');
  },
  'accessories.update'(state) {
    const data = {
      description: state.description,
      category: state.category,
      place: state.place,
      available: state.available,
      rented: state.rented,
      maintenance: state.maintenance,
      price: state.price,
      restitution: state.restitution,
      observations: state.observations,
      visible: true
    }
    Accessories.update({ _id: state._id }, { $set: data });
    Meteor.call('history.insert', data, 'accessories');
  }
})