import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Modules = new Mongo.Collection('modules');

if (Meteor.isServer) {

  Meteor.publish('modulesPub', () => {
    return Modules.find();
  })

  Modules.remove({});
  Modules.insert({
    _id: "0000",
    description: "Parede Branca",
    available: 10,
    rented: 5,
    maintenance: 3,
    visible: true
  });
  Modules.insert({
    _id: "0001",
    description: "Coluna Preta",
    available: 12,
    rented: 10,
    maintenance: 3,
    visible: true
  });
  Modules.insert({
    _id: "0002",
    description: "Coluna Galvanizada",
    available: 132,
    rented: 100,
    maintenance: 3,
    visible: true
  });
  Modules.insert({
    _id: "0003",
    description: "Coluna Azul",
    available: 132,
    rented: 100,
    maintenance: 7,
    visible: true
  });
  Modules.insert({
    _id: "0004",
    description: "Piso Preto",
    available: 132,
    rented: 100,
    maintenance: 10,
    visible: true
  });
  Modules.insert({
    _id: "0005",
    description: "Piso Branco",
    available: 132,
    rented: 100,
    maintenance: 35,
    visible: true
  });
  Modules.insert({
    _id: "0006",
    description: "Teto Preto",
    available: 132,
    rented: 100,
    maintenance: 1,
    visible: true
  });
  Modules.insert({
    _id: "0007",
    description: "Teto Azul",
    available: 132,
    rented: 100,
    maintenance: 0,
    visible: true
  });
}
Meteor.methods({
  'modules.insert'(state) {
    const _id = tools.generateId(Modules);
    const data = {
      _id,
      description: state.description,
      available: state.available,
      rented: state.rented,
      maintenance: state.maintenance,
      visible: true
    };
    Modules.insert(data);
    Meteor.call('history.insert', data, 'modules');
  },
  'modules.hide'(_id) {
    const data = {
      _id,
      visible: false
    };
    Modules.update({ _id }, { $set: data });
    Meteor.call('history.insert', data, 'modules');
  },
  'modules.rent' (modules) {
    var data = [];
    for (var i = 0; i < modules.length; i++) {
      var changes = {
        available: -modules[i].selected,
        rented: modules[i].selected
      }
      Modules.update({ _id: modules[i]._id }, { $inc: changes });
      if (!data.includes(modules[i])) data.push(modules[i]);
      Meteor.call('history.insert', data, 'modules.rent');
    }
  },
  'modules.receive' (modules) {
    var data = [];
    for (var i = 0; i < modules.length; i++) {
      var changes = {
        available: modules[i].selected,
        rented: -modules[i].selected
      }
      Modules.update({ _id: modules[i]._id }, { $inc: changes });
      if (!data.includes(modules[i])) data.push(modules[i]);
      Meteor.call('history.insert', data, 'modules.receive');
    }
  },
  'modules.update'(state) {
    const data = {
      _id: state._id,
      description: state.description,
      available: state.available,
      rented: state.rented,
      maintenance: state.maintenance,
      visible: true
    };
    Modules.update({ _id: state._id }, { $set: data });
    Meteor.call('history.insert', data, 'modules');
  }
})