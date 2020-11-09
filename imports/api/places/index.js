import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Series } from "/imports/api/series/index";
import tools from "/imports/startup/tools/index";

export const Places = new Mongo.Collection("places");
Places.attachSchema(
  new SimpleSchema({
    _id: String,
    description: String,
    visible: Boolean,
  })
);

Places.deny({
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
  Meteor.publish("placesPub", () => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    return Places.find({ visible: true });
  });

  Meteor.methods({
    "places.insert"(description) {
      if (!Meteor.userId() || !tools.isWriteAllowed("places")) {
        throw new Meteor.Error("unauthorized");
      }

      const _id = tools.generateId();
      const data = {
        _id,
        description,
        visible: true,
      };
      Places.insert(data);

      return true;
    },
    "places.hide"(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed("places")) {
        throw new Meteor.Error("unauthorized");
      }
      const data = {
        _id,
        visible: false,
      };
      Places.update({ _id }, { $set: data });

      return true;
    },
    "places.update"(_id, description) {
      if (!Meteor.userId() || !tools.isWriteAllowed("places")) {
        throw new Meteor.Error("unauthorized");
      }
      const data = {
        _id,
        description,
      };
      Places.update({ _id }, { $set: data });

      return true;
    },
  });
}
