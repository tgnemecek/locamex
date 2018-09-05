import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Containers = new Mongo.Collection('containers');

if (Meteor.isServer) {
  Meteor.publish('containersPub', () => {
    return Containers.find();
  })
  Containers.remove({});
  Containers.insert({
    _id: "0000",
    description: "Loca 300",
    type: "fixed",
    available: 1,
    price: 600,
    status: "available", //available, maintenance, rented, inactive
    restitution: 50000,
    place: "0000",
    observations: "Porta invertida",
    visible: true
  });
  Containers.insert({
    _id: "0001",
    description: "Loca 600",
    type: "fixed",
    price: 1200,
    status: "rented", //available, maintenance, rented, inactive
    restitution: 50000,
    place: "0001",
    observations: "Porta invertida",
    visible: true
  });
  Containers.insert({
    _id: "0002",
    description: "Loca 600",
    type: "fixed",
    price: 1200,
    status: "available", //available, maintenance, rented, inactive
    restitution: 50000,
    place: "0002",
    observations: "Porta invertida",
    visible: true
  });
  Containers.insert({
    _id: "0003",
    description: "Loca 600 D Black",
    type: "modular",
    price: 1800,
    restitution: 50000,
    assembled: 0,
    modules: ["0000", "0001"],
    visible: true
  });
}
Meteor.methods({
  'containers.insert'(state) {
    const _id = tools.generateId(Containers);
    var data;
    if (state.type == 'fixed') {
      data = {
        _id,
        description: state.description,
        type: state.type,
        place: state.place,
        status: state.status,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        visible: true
      }
    } else if (state.type == 'modular') {
      data = {
        _id,
        description: state.description,
        type: state.type,
        assembled: state.assembled,
        price: state.price,
        restitution: state.restitution,
        modules: state.modules,
        visible: true
      };
    }
    Containers.insert(data);
    Meteor.call('history.insert', data, 'containers');
  },
  'containers.hide'(_id) {
    const data = {
      visible: false
    };
    Containers.update({ _id }, { $set: data });
    Meteor.call('history.insert', data, 'containers');
  },
  'containers.status' (_id, status) {
    var data = {
      status
    }
    Containers.update({ _id }, { $set: data });
    Meteor.call('history.insert', data, 'containers');
  },
  'containers.update'(state) {
    var data;
    if (state.type == 'fixed') {
      data = {
        description: state.description,
        type: state.type,
        place: state.place,
        status: state.status,
        price: state.price,
        restitution: state.restitution,
        observations: state.observations,
        visible: true
      };
    } else if (state.type == 'modular') {
      data = {
        description: state.description,
        type: state.type,
        assembled: state.assembled,
        price: state.price,
        restitution: state.restitution,
        modules: state.modules,
        visible: true
      };
    }
    Containers.update({ _id: state._id }, { $set: data });
    Meteor.call('history.insert', data, 'containers');
  }
})