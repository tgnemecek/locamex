import { Mongo } from "meteor/mongo";
import { Containers } from "/imports/api/containers/index";
import SimpleSchema from "simpl-schema";
import tools from "/imports/startup/tools/index";

export const Modules = new Mongo.Collection("modules");
export const modulesSchema = new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  rented: SimpleSchema.Integer,
  places: Array,
  "places.$": Object,
  "places.$._id": String,
  "places.$.description": String,
  "places.$.available": SimpleSchema.Integer,
  "places.$.inactive": SimpleSchema.Integer,
  visible: Boolean,
});
Modules.attachSchema(modulesSchema);

Modules.deny({
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
  Meteor.publish("modulesPub", () => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("modules")) return [];
    return Modules.find({ visible: true }, { sort: { description: 1 } });
  });

  Meteor.methods({
    "modules.insert"(data) {
      if (!Meteor.userId() || !tools.isWriteAllowed("modules")) {
        throw new Meteor.Error("unauthorized");
      }
      const _id = tools.generateId();
      data = {
        _id,
        type: "module",
        description: data.description,
        rented: 0,
        places: [],
        visible: true,
      };
      Modules.insert(data);

      return true;
    },
    "modules.update.description"(_id, description) {
      if (!Meteor.userId() || !tools.isWriteAllowed("modules")) {
        throw new Meteor.Error("unauthorized");
      }
      Modules.update({ _id }, { $set: { description } });
      Containers.find({ "allowedModules._id": _id }).forEach((doc) => {
        let allowedModules = doc.allowedModules.map((module) => {
          if (module._id === _id) {
            return {
              ...module,
              description,
            };
          } else return module;
        });
        Containers.update(
          { _id: doc._id },
          {
            $set: { allowedModules },
          }
        );
      });
      return true;
    },
    "modules.update.stock"(module) {
      if (!Meteor.userId() || !tools.isWriteAllowed("modules")) {
        throw new Meteor.Error("unauthorized");
      }
      var places = module.places.filter((place) => {
        return place.available || place.inactive;
      });
      Modules.update({ _id: module._id }, { $set: { places } });
      return true;
    },
    "modules.shipping.send"(product) {
      if (!Meteor.userId() || !tools.isWriteAllowed("modules")) {
        throw new Meteor.Error("unauthorized");
      }
      var _id = product._id;
      delete product._id;
      Modules.update({ _id }, product);

      return true;
    },
    "modules.shipping.receive"(product) {
      if (!Meteor.userId() || !tools.isWriteAllowed("modules")) {
        throw new Meteor.Error("unauthorized");
      }
      var _id = product._id;
      delete product._id;
      Modules.update({ _id }, product);

      return true;
    },
    "modules.hide"(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed("modules")) {
        throw new Meteor.Error("unauthorized");
      }
      var module = Modules.findOne({ _id });
      if (module.rented) {
        throw new Meteor.Error("stock-must-be-zero");
      }
      var verification = module.places.every((place) => {
        return !place.available && !place.inactive;
      });
      if (!verification) {
        throw new Meteor.Error("stock-must-be-zero");
      }
      Modules.update({ _id }, { $set: { visible: false } });
      return true;
    },
  });
}
