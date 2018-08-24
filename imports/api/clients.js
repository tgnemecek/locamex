import { Mongo } from 'meteor/mongo';

export const Clients = new Mongo.Collection('clients');

if(Meteor.isServer) {

  Meteor.publish('clientsPub', () => {
    return Clients.find();
  })

  Clients.remove({});

  Clients.insert({
    _id: "0000",
    clientName: "Exemplo",
    type: "company",
    cnpj: 79288413000173,
    officialName: "Exemplo Empreendimentos",
    registryES: 192837273,
    registryMU: 364645445,
    address: {
      number: '100',
      street: 'Rua Joaquim Távora',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      cep: '04015010'
    },
    observations: '',
    contacts: [{
      "_id": "0000",
      contactName: "João Carlos",
      contactPhone1: 1195543122,
      contactPhone2: 1112341234,
      contactEmail: "joao.carlos@exemplo.com",
      contactCpf: 70844246018,
      visible: false
    }, {
      _id: "0001",
      contactName: "Cristina Clara",
      contactPhone1: 1254675333,
      contactPhone2: "",
      contactEmail: "cristina.clara@exemplo.com",
      contactCpf: 68383721005,
      visible: true
    }]
  });
  Clients.insert({
    _id: "0001",
    clientName: "João Augusto",
    type: "person",
    cnpj: "",
    officialName: "",
    registryES: "",
    registryMU: "",
    address: {
      number: '100',
      street: 'Rua Joaquim Távora',
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      cep: '04015010'
    },
    observations: "AAA",
    contacts: [{
      "_id": "0000",
      contactName: "João Augusto",
      contactPhone1: 11960324996,
      contactPhone2: 11947348222,
      contactEmail: "joao.augusto@gmail.com",
      contactCpf: 29577660002,
      visible: true
    }]
  });
}

  Meteor.methods({
    'clients.insert'(state) {

      const _id = Clients.find().count().toString().padStart(4, '0');

      let type = state.formType;
      let observations = state.observations;
      //Conditional Fields. If its not a company, the fields are empty
      let clientName = state.formType == 'company' ? state.clientName : state.contactInformation[0].contactName;
      let cnpj = state.formType == 'company' ? state.cnpj : '';
      let officialName = state.formType == 'company' ? state.officialName : '';
      let registryES = state.formType == 'company' ? state.registryES : '';
      let registryMU = state.formType == 'company' ? state.registryMU : '';

      let contacts = [];

      state.contactInformation.forEach((contact, i) => {
        contacts[i] = tools.deepCopy(contact);
      })

      Clients.insert({
        _id,
        clientName,
        type,
        cnpj,
        officialName,
        registryES,
        registryMU,
        observations,
        contacts
      });
    },

    'clients.hideContact'(_id, contactId) {

      let contacts = Clients.find({ _id }).fetch()[0].contacts;

      let contactToUpdate = contacts.find((element) => {
        return element._id === contactId;
      })

      contactToUpdate.visible = false;

      Clients.update({ _id }, { $set: { contacts } });
    },

    'clients.update'(_id, state) {

      var contacts = Clients.find({_id}).fetch()[0].contacts;
      var newContacts = [];

      for (var i = 0; i < state.contactInformation.length; i++) {
        if (state.contactInformation[i]._id == '') {
          newContacts.push(state.contactInformation[i]);
          continue;
        }
        for (var j = 0; j < contacts.length; j++) {
          if (state.contactInformation[i]._id == contacts[j]._id) {
            contacts[j] = state.contactInformation[i];
            continue;
          }
        }
      }

      for (var i = 0; i < newContacts.length; i++) {
        newContacts[i]._id = contacts.length.toString().padStart(4, '0');
        contacts.push(newContacts[i]);
      }

      Clients.update({ _id }, { $set: {
        clientName: state.formType == 'company' ? state.clientName : state.contactInformation[0].contactName,
        cnpj: state.cnpj,
        officialName: state.officialName,
        registryES: state.registryES,
        registryMU: state.registryMU,
        contacts,
        observations: state.observations
        } });
    }
  })