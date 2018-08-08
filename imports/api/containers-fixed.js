import { Mongo } from 'meteor/mongo';

export const ContainersFixed = new Mongo.Collection('containersFixed');

if(Meteor.isServer) {

  Meteor.publish('containersFixedPub', () => {
    return ContainersFixed.find();
  })

  ContainersFixed.remove({});

  ContainersFixed.insert({
    _id: "0000",
    description: "Loca 300",
    price: 600,
    status: "available", //available, maintenance, rented, inactive
    place: 0003, //_id of place
    images: [],
    observations: "Porta invertida",
    history: []
  });
  ContainersFixed.insert({
    _id: "0001",
    description: "Loca 600",
    price: 1200,
    status: "available", //available, maintenance, rented, inactive
    place: 0002, //_id of place
    images: [],
    observations: "Porta invertida",
    history: []
  });
}

  Meteor.methods({
    'ContainersFixed.insert'(state) {

      const _id = ContainersFixed.find().count().toString().padStart(4, '0');

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
        contacts[i] = JSON.parse(JSON.stringify(contact));
      })

      ContainersFixed.insert({
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

    'ContainersFixed.hideContact'(_id, contactId) {

      let contacts = ContainersFixed.find({ _id }).fetch()[0].contacts;

      let contactToUpdate = contacts.find((element) => {
        return element._id === contactId;
      })

      contactToUpdate.visible = false;

      ContainersFixed.update({ _id }, { $set: { contacts } });
    },

    'ContainersFixed.update'(_id, state) {

      var contacts = ContainersFixed.find({_id}).fetch()[0].contacts;
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

      ContainersFixed.update({ _id }, { $set: {
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