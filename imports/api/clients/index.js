import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Clients = new Mongo.Collection('clients');

if (Meteor.isServer) {
  Meteor.publish('clientsPub', () => {
    return Clients.find();
  })
  Clients.remove({});
  Clients.insert({
    _id: "0000",
    description: "Exemplo",
    officialName: "Exemplo Empreendimentos",
    type: "company",
    registry: "79288413000173",
    registryES: "192837273",
    registryMU: "364645445",
    visible: true,
    address: {
      number: '100',
      street: 'Rua Joaquim Távora',
      city: 'São Paulo',
      state: 'SP',
      cep: '04015010',
      additional: ''
    },
    observations: '',
    contacts: [{
      "_id": "0000",
      name: "João Carlos",
      phone1: "1195543122",
      phone2: "1112341234",
      email: "joao.carlos@exemplo.com",
      cpf: "70844246018",
      rg: "493769388",
      visible: false
    }, {
      _id: "0001",
      name: "Cristina Clara",
      phone1: "1254675333",
      phone2: "",
      email: "cristina.clara@exemplo.com",
      cpf: "68383721005",
      rg: "493769388",
      visible: true
    }]
  });
  Clients.insert({
    _id: "0001",
    description: "João Augusto",
    type: "person",
    registry: "29577660002",
    visible: true,
    address: {
      number: '100',
      street: 'Rua Joaquim Távora',
      city: 'São Paulo',
      state: 'SP',
      cep: '04015010',
      additional: ''
    },
    observations: "",
    contacts: [{
      _id: "0000",
      name: "João Augusto",
      phone1: "11960324996",
      phone2: "11947348222",
      email: "joao.augusto@gmail.com",
      cpf: "29577660002",
      rg: "493769388",
      visible: true
    }]
  });
}

Meteor.methods({
  'clients.insert'(state) {
    const _id = tools.generateId(Clients);
    const data = {
      _id,
      description: state.description,
      type: state.description,
      registry: state.registry,
      officialName: state.officialName,
      registryES: state.registryES,
      registryMU: state.registryMU,
      observations: state.observations,
      contacts: state.contacts,
      visible: true
    };
    Clients.insert(data);
    Meteor.call('history.insert', data, 'clients');
  },

  'clients.hideContact'(_id, contactId) {
    var client = Clients.findOne({ _id })
    var contacts = client.contacts;
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i]._id === contactId) {
        contacts[i].visible = false;
      }
    }
    const data = {
      _id,
      contacts
    }
    Clients.update({ _id }, { $set: data });
    Meteor.call('history.insert', data, 'clients');
  },

  'clients.update'(state) {
    const data = {
      _id: state._id,
      description: state.description,
      registry: state.registry,
      officialName: state.officialName,
      registryES: state.registryES,
      registryMU: state.registryMU,
      contacts: state.contacts,
      address: state.address,
      observations: state.observations
    };
    Clients.update({ _id: state._id }, { $set: data });
    Meteor.call('history.insert', data, 'clients');
  }
})