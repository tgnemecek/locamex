import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Contracts = new Mongo.Collection('contracts');

if(Meteor.isServer) {

  Meteor.publish('contractsPub', () => {
    return Contracts.find();
  })

  Contracts.remove({});

  Contracts.insert({
    _id: "0000",
    clientId: "0000",
    type: "rent", //rent-sell
    status: "active", //active-inactive-cancelled-finished
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
    services: []
  });
}


  Meteor.methods({
    'Contracts.insert'(state) {

      const _id = Contracts.find().count().toString().padStart(4, '0');

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

      Contracts.insert({
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

    'Contracts.hideContact'(_id, contactId) {

      let contacts = Contracts.find({ _id }).fetch()[0].contacts;

      let contactToUpdate = contacts.find((element) => {
        return element._id === contactId;
      })

      contactToUpdate.visible = false;

      Contracts.update({ _id }, { $set: { contacts } });
    },

    'Contracts.update'(_id, state) {

      var contacts = Contracts.find({_id}).fetch()[0].contacts;
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

      Contracts.update({ _id }, { $set: {
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