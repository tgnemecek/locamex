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
      cnpj: "3123131233",
      officialName: "Exemplo Empreendimentos",
      registryES: "192837273",
      registryMU: "364645445",
      observations: 'Cliente do Rio de Janeiro',
      contacts: [{
        "_id": "0000",
        contactName: "João Carlos",
        contactPhone1: "9554-3122",
        contactPhone2: "1234-1234",
        contactEmail: "joao.carlos@exemplo.com",
        contactCPF: "532.353.653-12",
        visible: false
      }, {
        _id: "0001",
        contactName: "Cristina Clara",
        contactPhone1: "5467-5333",
        contactPhone2: "",
        contactEmail: "cristina.clara@exemplo.com",
        contactCPF: "887.774.1638-76",
        visible: true
      }]
    });
  }

  Meteor.methods({
    'clients.insert'(description, price) {

      const _id = Clients.find().count().toString().padStart(4, '0');

      Clients.insert({
        _id,
        description,
        price,
        visible: true
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
          console.log(newContacts);
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