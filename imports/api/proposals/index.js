import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import tools from "/imports/startup/tools/index";

import { Series } from "/imports/api/series/index";
import { Modules } from "/imports/api/modules/index";
import { Accessories } from "/imports/api/accessories/index";
import { Containers } from "/imports/api/containers/index";
import { Services } from "/imports/api/services/index";

export const Proposals = new Mongo.Collection("proposals");

Proposals.attachSchema(
  new SimpleSchema({
    _id: String,
    type: String,
    status: String,
    visible: Boolean,
    clientDescription: {
      type: String,
      optional: true,
    },
    totalValue: Number,
    snapshots: Array,
    "snapshots.$": new SimpleSchema({
      active: Boolean,
      createdById: String,
      createdByName: String,
      client: {
        type: Object,
        blackbox: true,
      },
      discount: Number,
      observations: Object,
      "observations.internal": {
        type: String,
        optional: true,
      },
      "observations.external": {
        type: String,
        optional: true,
      },
      "observations.conditions": {
        type: String,
        optional: true,
      },
      deliveryAddress: {
        type: Object,
        blackbox: true,
      },
      dates: Object,
      "dates.creationDate": Date,
      "dates.startDate": Date,
      "dates.duration": SimpleSchema.Integer,
      "dates.creationDate": Date,
      "dates.timeUnit": {
        type: String,
        allowedValues: ["months", "days"],
      },

      containers: Array,
      "containers.$": Object,
      "containers.$._id": String,
      "containers.$.type": String,
      "containers.$.description": String,
      "containers.$.restitution": Number,
      "containers.$.price": Number,
      "containers.$.quantity": SimpleSchema.Integer,
      "containers.$.flyer": {
        type: Object,
        optional: true,
      },
      "containers.$.flyer.paragraphs": Array,
      "containers.$.flyer.paragraphs.$": String,
      "containers.$.flyer.images": Array,
      "containers.$.flyer.images.$": String,

      accessories: Array,
      "accessories.$": Object,
      "accessories.$._id": String,
      "accessories.$.type": String,
      "accessories.$.description": String,
      "accessories.$.restitution": Number,
      "accessories.$.price": Number,
      "accessories.$.quantity": SimpleSchema.Integer,

      services: Array,
      "services.$": Object,
      "services.$._id": String,
      "services.$.type": String,
      "services.$.description": String,
      "services.$.price": Number,
      "services.$.quantity": SimpleSchema.Integer,
    }),
  })
);

Proposals.deny({
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
  Meteor.publish("proposalsPub", ({ query = {}, limit }) => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("proposals")) return [];
    return Proposals.find(query, {
      sort: { _id: -1 },
      limit: limit || 0,
      fields: {
        clientDescription: 1,
        status: 1,
        totalValue: 1,
      },
    });
  });
  Meteor.publish("proposalPub", (_id) => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("proposals")) return [];
    return Proposals.find({ _id });
  });

  Meteor.methods({
    "proposals.insert"(snapshot) {
      if (!Meteor.userId() || !tools.isWriteAllowed("proposals")) {
        throw new Meteor.Error("unauthorized");
      }
      const prefix = new Date().getFullYear();
      const offset = 0;
      const suffix =
        Proposals.find({
          _id: { $regex: new RegExp(prefix) },
        }).count() + offset;
      var _id = prefix + "-" + suffix.toString().padStart(4, "0");

      var proposal = {
        _id,
        type: "proposal",
        status: "inactive",
        snapshots: [snapshot],
        totalValue: tools.totalValue(snapshot),
        clientDescription: snapshot.client.description,
        visible: true,
      };
      Proposals.insert(proposal);

      return {
        proposal,
        snapshot,
        index: 0,
      };
    },
    "proposals.update"(snapshot, _id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed("proposals")) {
        throw new Meteor.Error("unauthorized");
      }
      var oldProposal = Proposals.findOne({ _id });
      var hasChanged = !tools.compare(
        oldProposal.snapshots[index],
        snapshot,
        "observations.internal"
      );
      if (!hasChanged) {
        return {
          hasChanged: false,
          snapshot,
          proposal: oldProposal,
          index,
        };
      }
      var data = tools.deepCopy(oldProposal);
      data.snapshots.push(snapshot);

      data.totalValue = tools.totalValue(snapshot);
      data.clientDescription = snapshot.client.description;

      Proposals.update({ _id }, { $set: data });

      return {
        hasChanged: true,
        snapshot,
        proposal: data,
        index: oldProposal.snapshots.length,
      };
    },
    "proposals.activate"(_id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed("proposals")) {
        throw new Meteor.Error("unauthorized");
      }
      var proposal = Proposals.findOne({ _id });
      var backupProposal = tools.deepCopy(proposal);
      var snapshot = proposal.snapshots[index];

      function findDeletedItems(array, Database) {
        var itemDescription = "";
        var verification = array.every((item) => {
          itemDescription = item.description;
          var itemFromDB = Database.findOne({ _id: item._id });
          return itemFromDB.visible;
        });
        if (!verification) {
          throw new Meteor.Error(
            "document-contains-deleted-items",
            itemDescription
          );
        }
      }

      findDeletedItems(snapshot.containers, Containers);
      findDeletedItems(snapshot.accessories, Accessories);
      findDeletedItems(snapshot.services, Services);

      proposal.status = "active";
      proposal.snapshots[index].active = true;
      Proposals.update({ _id }, { $set: proposal });
      try {
        var contractId = Meteor.call("contracts.insert", _id);
        return contractId;
      } catch (err) {
        Proposals.update({ _id }, backupProposal);
        throw err;
      }
    },
    "proposals.cancel"(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed("proposals")) {
        throw new Meteor.Error("unauthorized");
      }
      Proposals.update({ _id }, { $set: { status: "cancelled" } });

      return _id;
    },
  });
}
