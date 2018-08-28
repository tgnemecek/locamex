import { Mongo } from 'meteor/mongo';

export const Clients = new Mongo.Collection('clients');

if(Meteor.isServer) {

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
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      cep: '04015010'
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
      district: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      cep: '04015010'
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

      const _id = Clients.find().count().toString().padStart(4, '0');

      let type = state.formType;
      let observations = state.observations;
      //Conditional Fields. If its not a company, the fields are empty
      let description = state.formType == 'company' ? state.description : state.contactInformation[0].name;
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
        description,
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
        description: state.formType == 'company' ? state.description : state.contactInformation[0].name,
        cnpj: state.cnpj,
        officialName: state.officialName,
        registryES: state.registryES,
        registryMU: state.registryMU,
        contacts,
        observations: state.observations
        } });
    }
  })