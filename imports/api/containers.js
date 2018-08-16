import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import customTypes from '/imports/startup/custom-types';

export const Containers = new Mongo.Collection('containers');

if(Meteor.isServer) {

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
    place: 0003, //_id of place
    images: [],
    observations: "Porta invertida",
    history: []
  });
  Containers.insert({
    _id: "0001",
    description: "Loca 600",
    type: "fixed",
    price: 1200,
    status: "rented", //available, maintenance, rented, inactive
    restitution: 50000,
    place: 0002, //_id of place
    images: [],
    observations: "Porta invertida",
    history: []
  });
  Containers.insert({
    _id: "0002",
    description: "Loca 600",
    type: "fixed",
    price: 1200,
    status: "available", //available, maintenance, rented, inactive
    restitution: 50000,
    place: 0002, //_id of place
    images: [],
    observations: "Porta invertida",
    history: []
  });
  Containers.insert({
    _id: "0003",
    description: "Loca 600 D Black",
    type: "modular",
    status: "available",
    price: 1800,
    restitution: 50000,
    assembled: 0,
    allowedModules: ["0000", "0001"],
    history: []
  });
}

  Meteor.methods({
    'Containers.insert'(state) {

      const _id = Containers.find().count().toString().padStart(4, '0');

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
        contacts[i] = customTypes.deepCopy(contact);
      })

      Containers.insert({
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

    'Containers.hideContact'(_id, contactId) {

      let contacts = Containers.find({ _id }).fetch()[0].contacts;

      let contactToUpdate = contacts.find((element) => {
        return element._id === contactId;
      })

      contactToUpdate.visible = false;

      Containers.update({ _id }, { $set: { contacts } });
    },

    'Containers.update'(_id, state) {

      var contacts = Containers.find({_id}).fetch()[0].contacts;
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

      Containers.update({ _id }, { $set: {
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