import { Mongo } from 'meteor/mongo';

export const ContainersModular = new Mongo.Collection('containersModular');

if(Meteor.isServer) {

  Meteor.publish('containersModularPub', () => {
    return ContainersModular.find();
  })

  ContainersModular.remove({});

  ContainersFixed.insert({
    _id: "0000",
    description: "Loca 300 Black",
    price: 600,
    modules: [], //_ids of the modules that it uses
    history: [],
    visible: true
  });
  ContainersFixed.insert({
    _id: "0001",
    description: "Loca 600 Black",
    price: 600,
    modules: [], //_ids of the modules that it uses
    history: [],
    visible: true
  });
}

  Meteor.methods({
    'ContainersModular.insert'(state) {

      const _id = ContainersModular.find().count().toString().padStart(4, '0');

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

      ContainersModular.insert({
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

    'ContainersModular.hideContact'(_id, contactId) {

      let contacts = ContainersModular.find({ _id }).fetch()[0].contacts;

      let contactToUpdate = contacts.find((element) => {
        return element._id === contactId;
      })

      contactToUpdate.visible = false;

      ContainersModular.update({ _id }, { $set: { contacts } });
    },

    'ContainersModular.update'(_id, state) {

      var contacts = ContainersModular.find({_id}).fetch()[0].contacts;
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

      ContainersModular.update({ _id }, { $set: {
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