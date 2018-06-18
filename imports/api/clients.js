import { Mongo } from 'meteor/mongo';

export const Clients = new Mongo.Collection('clients');

if(Meteor.isServer) {

    if (Meteor.isServer) {
      Meteor.publish('clientsPub', () => {
        return Clients.find();
      })
    }

    Clients.remove({});

    Clients.insert({
      _id: "0000",
      companyName: "Exemplo",
      type: "company",
      cnpj: 79288413000173,
      officialName: "Exemplo Empreendimentos",
      registryES: 192837273,
      registryMU: 364645445,
      observations: 'Cliente do Rio de Janeiro',
      contacts: [{
        "_id": "0000",
        contactName: "João Carlos",
        contactPhone1: 1195543122,
        contactPhone2: 1112341234,
        contactEmail: "joao.carlos@exemplo.com",
        contactCPF: 33568712098,
        visible: false
      }, {
        _id: "0001",
        contactName: "Cristina Clara",
        contactPhone1: 1254675333,
        contactPhone2: "",
        contactEmail: "cristina.clara@exemplo.com",
        contactCPF: 24498709933,
        visible: true
      }]
    });
    Clients.insert({
      _id: "0001",
      companyName: "",
      type: "person",
      cnpj: "",
      officialName: "",
      registryES: "",
      registryMU: "",
      observations: "AAA",
      contacts: [{
        "_id": "0000",
        contactName: "João Augusto",
        contactPhone1: 11960324996,
        contactPhone2: 11947348222,
        contactEmail: "joao.augusto@gmail.com",
        contactCPF: 29577660002,
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
      let companyName = state.formType == 'company' ? state.companyName : '';
      let cnpj = state.formType == 'company' ? state.cnpj : '';
      let officialName = state.formType == 'company' ? state.officialName : '';
      let registryES = state.formType == 'company' ? state.registryES : '';
      let registryMU = state.formType == 'company' ? state.registryMU : '';

      let contacts = [];

      state.contactInformation.forEach((contact, i) => {
        contacts[i] = JSON.parse(JSON.stringify(contact));
      })

      Clients.insert({
        _id,
        companyName,
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
        companyName: state.companyName,
        cnpj: state.cnpj,
        officialName: state.officialName,
        registryES: state.registryES,
        registryMU: state.registryMU,
        contacts,
        observations: state.observations
        } });
    }
  })