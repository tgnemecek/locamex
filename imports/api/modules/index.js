import { Mongo } from 'meteor/mongo';

export const Modules = new Mongo.Collection('modules');

if(Meteor.isServer) {

  Meteor.publish('modulesPub', () => {
    return Modules.find();
  })

  Modules.remove({});

  Modules.insert({
    _id: "0000",
    description: "Parede Branca",
    quantity: 10,
    available: 5,
    visible: true
  });
  Modules.insert({
    _id: "0001",
    description: "Coluna Preta",
    quantity: 12,
    available: 10,
    visible: true
  });
  Modules.insert({
    _id: "0002",
    description: "Coluna Galvanizada",
    quantity: 132,
    available: 100,
    visible: true
  });
}

  Meteor.methods({
    'Modules.insert'(state) {

      const _id = Modules.find().count().toString().padStart(4, '0');

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

      Modules.insert({
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

    'Modules.hideContact'(_id, contactId) {

      let contacts = Modules.find({ _id }).fetch()[0].contacts;

      let contactToUpdate = contacts.find((element) => {
        return element._id === contactId;
      })

      contactToUpdate.visible = false;

      Modules.update({ _id }, { $set: { contacts } });
    },

    'Modules.update'(_id, state) {

      var contacts = Modules.find({_id}).fetch()[0].contacts;
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

      Modules.update({ _id }, { $set: {
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