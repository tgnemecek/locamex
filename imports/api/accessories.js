import { Mongo } from 'meteor/mongo';
import customTypes from '/imports/startup/custom-types';

export const Accessories = new Mongo.Collection('accessories');

if(Meteor.isServer) {

    if (Meteor.isServer) {
      Meteor.publish('accessoriesPub', () => {
        return Accessories.find();
      })
    }

    Accessories.remove({});

    Accessories.insert({
      _id: "0000",
      description: "Exemplo",
      type: "company",
      cnpj: 79288413000173,
      officialName: "Exemplo Empreendimentos",
      registryES: 192837273,
      registryMU: 364645445,
      observations: 'Cliente do Rio de Janeiro'
    })
  }

  // Meteor.methods({
  //   'clients.insert'(state) {
  //
  //     const _id = Clients.find().count().toString().padStart(4, '0');
  //
  //     let type = state.formType;
  //     let observations = state.observations;
  //     //Conditional Fields. If its not a company, the fields are empty
  //     let clientName = state.formType == 'company' ? state.clientName : state.contactInformation[0].contactName;
  //     let cnpj = state.formType == 'company' ? state.cnpj : '';
  //     let officialName = state.formType == 'company' ? state.officialName : '';
  //     let registryES = state.formType == 'company' ? state.registryES : '';
  //     let registryMU = state.formType == 'company' ? state.registryMU : '';
  //
  //     let contacts = [];
  //
  //     state.contactInformation.forEach((contact, i) => {
  //       contacts[i] = customTypes.deepCopy(contact);
  //     })
  //
  //     Clients.insert({
  //       _id,
  //       clientName,
  //       type,
  //       cnpj,
  //       officialName,
  //       registryES,
  //       registryMU,
  //       observations,
  //       contacts
  //     });
  //   },
  //
  //   'clients.hideContact'(_id, contactId) {
  //
  //     let contacts = Clients.find({ _id }).fetch()[0].contacts;
  //
  //     let contactToUpdate = contacts.find((element) => {
  //       return element._id === contactId;
  //     })
  //
  //     contactToUpdate.visible = false;
  //
  //     Clients.update({ _id }, { $set: { contacts } });
  //   },
  //
  //   'clients.update'(_id, state) {
  //
  //     var contacts = Clients.find({_id}).fetch()[0].contacts;
  //     var newContacts = [];
  //
  //     for (var i = 0; i < state.contactInformation.length; i++) {
  //       if (state.contactInformation[i]._id == '') {
  //         newContacts.push(state.contactInformation[i]);
  //         continue;
  //       }
  //       for (var j = 0; j < contacts.length; j++) {
  //         if (state.contactInformation[i]._id == contacts[j]._id) {
  //           contacts[j] = state.contactInformation[i];
  //           continue;
  //         }
  //       }
  //     }
  //
  //     for (var i = 0; i < newContacts.length; i++) {
  //       newContacts[i]._id = contacts.length.toString().padStart(4, '0');
  //       contacts.push(newContacts[i]);
  //     }
  //
  //     Clients.update({ _id }, { $set: {
  //       clientName: state.clientName,
  //       cnpj: state.cnpj,
  //       officialName: state.officialName,
  //       registryES: state.registryES,
  //       registryMU: state.registryMU,
  //       contacts,
  //       observations: state.observations
  //       } });
  //   }
  // })