import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import tools from "/imports/startup/tools/index";
import { addressSchema } from "/imports/api/address/index";
import { Contracts } from "/imports/api/contracts/index";

export const Clients = new Mongo.Collection("clients");
Clients.attachSchema(
  new SimpleSchema({
    _id: String,
    type: String,
    description: String,
    registry: String,
    officialName: String,
    registryES: {
      type: String,
      optional: true,
    },
    registryMU: {
      type: String,
      optional: true,
    },
    observations: {
      type: String,
      optional: true,
    },
    contacts: Array,
    "contacts.$": Object,
    "contacts.$._id": String,
    "contacts.$.name": String,
    "contacts.$.phone1": {
      type: String,
      optional: true,
    },
    "contacts.$.phone2": {
      type: String,
      optional: true,
    },
    "contacts.$.email": {
      type: String,
      optional: true,
    },
    "contacts.$.cpf": {
      type: String,
      optional: true,
    },
    "contacts.$.rg": {
      type: String,
      optional: true,
    },
    "contacts.$.visible": Boolean,
    address: addressSchema,
    visible: Boolean,
  }),
  { selector: { type: "company" } }
);

Clients.attachSchema(
  new SimpleSchema({
    _id: String,
    type: String,
    description: String,
    registry: String,
    observations: {
      type: String,
      optional: true,
    },
    rg: {
      type: String,
      optional: true,
    },
    phone1: {
      type: String,
      optional: true,
    },
    phone2: {
      type: String,
      optional: true,
    },
    email: String,
    contacts: Array,
    "contacts.$": Object,
    "contacts.$._id": {
      type: String,
      optional: true,
    },
    "contacts.$.name": String,
    "contacts.$.phone1": {
      type: String,
      optional: true,
    },
    "contacts.$.phone2": {
      type: String,
      optional: true,
    },
    "contacts.$.email": {
      type: String,
      optional: true,
    },
    "contacts.$.cpf": {
      type: String,
      optional: true,
    },
    "contacts.$.rg": {
      type: String,
      optional: true,
    },
    "contacts.$.visible": Boolean,
    address: addressSchema,
    visible: Boolean,
  }),
  { selector: { type: "person" } }
);

Clients.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

if (Meteor.isServer) {
  Meteor.publish("clientsPub", () => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("clients")) return [];
    return Clients.find({ visible: true }, { sort: { description: 1 } });
  });
  Meteor.methods({
    "clients.insert"(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed("clients")) {
        throw new Meteor.Error("unauthorized");
      }
      const exists = Clients.findOne({ registry: state.registry });
      if (exists) {
        throw new Meteor.Error("duplicate-registry");
      }
      const _id = tools.generateId();
      var data = {};
      if (state.type == "company") {
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
          visible: true,
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
          visible: true,
        };
      }
      Clients.insert(data);

      return data;
    },

    "clients.update"(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed("clients")) {
        throw new Meteor.Error("unauthorized");
      }
      var data = {};
      if (state.type === "company") {
        data = {
          _id: state._id,
          description: state.description,
          type: "company",
          registry: state.registry,
          officialName: state.officialName,
          registryES: state.registryES,
          registryMU: state.registryMU,
          observations: state.observations,
          contacts: state.contacts,
          address: state.address,
        };
      } else {
        data = {
          _id: state._id,
          description: state.description,
          type: "person",
          registry: state.registry,
          rg: state.rg,
          phone1: state.phone1,
          phone2: state.phone2,
          email: state.email,
          observations: state.observations,
          contacts: state.contacts,
          address: state.address,
        };
      }
      Clients.update({ _id: state._id }, { $set: data });
      Contracts.find({ status: "inactive" }).forEach((contract) => {
        contract.snapshots.forEach((snapshot) => {
          if (snapshot.client._id === state._id) {
            snapshot.client = data;
          }
        });
        Contracts.update({ _id: contract._id }, { $set: contract });
      });

      return state._id;
    },
  });
}
