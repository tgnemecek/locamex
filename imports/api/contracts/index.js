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
  },
  'contracts.activate'(state) {
    const data = {
      _id: state._id,
      status: "active"
    }
    Meteor.call('contracts.update', state, () => {
      Contracts.update({ _id }, { $set: data });
    });
    Meteor.call('history.insert', data, 'contracts');
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