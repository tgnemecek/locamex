import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Clients = new Mongo.Collection('clients');

if (Meteor.isServer) {
  Meteor.publish('clientsPub', () => {
    return Clients.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'clients.insert'(state) {
      const _id = tools.generateId("clients");
      var data = {};
      if (state.type == 'company') {
        data = {
          _id,
          description: state.description,
          type: state.type,
          registry: state.registry,
          officialName: state.officialName,
          registryES: state.registryES,
          registryMU: state.registryMU,
          observations: state.observations,
          contacts: state.contacts,
          address: state.address,
          visible: true
        };
      } else {
        data = {
          _id,
          description: state.description,
          type: state.type,
          registry: state.registry,
          rg: state.rg,
          phone1: state.phone1,
          phone2: state.phone2,
          email: state.email,
          observations: state.observations,
          contacts: state.contacts,
          address: state.address,
          visible: true
        };
      }
      Clients.insert(data);
      Meteor.call('history.insert', data, 'clients');
    },

    'clients.hideContact'(_id, contactId) {
      var client = Clients.findOne({ _id })
      var contacts = client.contacts;
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i]._id === contactId) {
          contacts[i].visible = false;
        }
      }
      const data = {
        _id,
        contacts
      }
      Clients.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'clients');
    },

    'clients.update'(state) {
      var data = {};
      if (state.type == 'company') {
        data = {
          _id: state._id,
          description: state.description,
          type: state.type,
          registry: state.registry,
          officialName: state.officialName,
          registryES: state.registryES,
          registryMU: state.registryMU,
          observations: state.observations,
          contacts: state.contacts,
          address: state.address
        };
      } else {
        data = {
          _id: state._id,
          description: state.description,
          type: state.type,
          registry: state.registry,
          rg: state.rg,
          phone1: state.phone1,
          phone2: state.phone2,
          email: state.email,
          observations: state.observations,
          contacts: state.contacts,
          address: state.address
        };
      }
      Clients.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'clients');
    }
  })
}