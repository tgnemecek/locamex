import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Contracts = new Mongo.Collection('contracts');

if (Meteor.isServer) {

  Meteor.publish('contractsPub', () => {
    return Contracts.find();
  })

  Contracts.remove({});

  Contracts.insert({
    _id: "0000",
    clientId: "0000",
    status: "inactive", //active-inactive-cancelled-finished
    createdBy: "Funcionário 1",
    dates: {
      creationDate: new Date(),
      startDate: new Date(),
      duration: 6
    },
    billing: [],
    observations: 'Exposição nova',
    deliveryAddress: {
      state: "SP",
      city: "São Paulo",
      street: "Rua Sonia Ribeiro",
      number: 1212,
      additional: "Casa 4",
      district: "Brooklin Paulista",
      cep: 04621010
    },
    containers: [],
    accessories: [],
    services: [],
    visible: true
  });
}

Meteor.methods({
  'contracts.insert'(state) {
    const _id = tools.generateId(Contracts);
    const data = {
      _id,
      clientId: state.clientId,
      status: state.status,
      createdBy: state.createdBy,
      dates: state.dates,
      billing: state.billing,
      observations: state.observations,
      deliveryAddress: state.deliveryAddress,
      containers: state.containers,
      accessories: state.accessories,
      services: state.services,
      visible: true
    };
    Contracts.insert(data);
    Meteor.call('history.insert', data, 'contracts');
    return _id;
  },
  'contracts.activate'(state) {
    const activate = (_id) => {
      const data = {
        ...state,
        _id: _id || state._id,
        status: "active"
      }
      var modules = [];
      for (var i = 0; i < data.containers.length; i++) {
        if (data.containers[i].type === 'modular') {
          data.containers[i].modules.forEach((module) => {
            module.selected = module.selected * data.containers[i].quantity;
          })
          modules = modules.concat(data.containers[i].modules);
        } else if (data.containers[i].type === 'fixed') {
          Meteor.call('containers.status', data.containers[i]._id, "rented");
        }
      }
      Meteor.call('modules.rent', modules);
      Meteor.call('contracts.update', data);
      Meteor.call('history.insert', data, 'contracts');
      return data._id;
    }
    if (!state._id) {
      var _id = Meteor.call('contracts.insert', state);
      return activate(_id);
    } else return activate();
  },
  'contracts.finalize'(_id, products) {
    const data = {
      _id,
      status: "finalized"
    }
    var modules = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].type === 'modular') {
        if (products[i].selectedAssembled > 0) {
          Meteor.call('containers.updateAssembled', products[i].containerId, products[i].selectedAssembled);
        }
        products[i].modules.forEach((module) => {
          module.selected = module.selected * (products[i].quantity - products[i].selectedAssembled);
        })
        modules = modules.concat(products[i].modules);
      } else if (products[i].type === 'fixed') {
        Meteor.call('containers.status', products[i]._id, "available");
      }
    }
    Meteor.call('modules.receive', modules);
    Meteor.call('contracts.update', data);
    Meteor.call('history.insert', data, 'contracts');
    return data._id;
  },
  'contracts.cancel'(_id) {
    const data = {
      _id,
      status: "cancelled"
    }
    Contracts.update({ _id }, { $set: data });
    Meteor.call('history.insert', data, 'contracts');
  },
  'contracts.update'(state) {
    const data = {
      _id: state._id,
      clientId: state.clientId,
      status: state.status,
      createdBy: state.createdBy,
      dates: state.dates,
      billing: state.billing,
      observations: state.observations,
      deliveryAddress: state.deliveryAddress,
      containers: state.containers,
      accessories: state.accessories,
      services: state.services,
      visible: true
    }
    Contracts.update({ _id: state._id }, { $set: data });
    Meteor.call('history.insert', data, 'contracts');
  }
})