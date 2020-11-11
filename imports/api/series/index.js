import { Mongo } from "meteor/mongo";
import moment from "moment";
import SimpleSchema from "simpl-schema";
import { Meteor } from "meteor/meteor";
import tools from "/imports/startup/tools/index";

import { Contracts } from "/imports/api/contracts/index";
import { Places } from "/imports/api/places/index";
import { Containers } from "/imports/api/containers/index";

export const Series = new Mongo.Collection("series");
Series.attachSchema(
  new SimpleSchema({
    _id: String,
    type: String,
    description: String,
    rented: Boolean,
    container: Object,
    "container._id": String,
    "container.description": String,
    place: Object,
    "place._id": {
      type: String,
      optional: true,
    },
    "place.description": {
      type: String,
      optional: true,
    },

    observations: {
      type: String,
      optional: true,
    },
    snapshots: Array,
    "snapshots.$": Object,
    "snapshots.$.date": Date,
    "snapshots.$.images": Array,
    "snapshots.$.images.$": String,
    visible: Boolean,
  })
);

Series.deny({
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
  Meteor.publish("seriesPub", () => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("series")) return [];
    return Series.find({ visible: true }, { sort: { description: 1 } });
  });
  Meteor.methods({
    "series.insert"(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed("series")) {
        throw new Meteor.Error("unauthorized");
      }
      var found = Series.findOne({
        $and: [
          { description: state.description.toString() },
          { visible: true },
        ],
      });

      if (found) throw new Meteor.Error("description-in-use");

      var data = {
        description: state.description.toString(),
        container: state.container,
        rented: false,
        place: state.place,
        observations: state.observations,
        type: "series",
        snapshots: [],
        visible: true,
      };
      Series.insert(data);
      return true;
    },
    "series.update"(state) {
      if (
        !Meteor.userId() ||
        (!tools.isWriteAllowed("series") &&
          !tools.isWriteAllowed("series.place"))
      ) {
        throw new Meteor.Error("unauthorized");
      }
      var data = {
        _id: state._id,
        place: state.place,
        observations: state.observations,
      };
      Series.update({ _id: state._id }, { $set: data });

      return state._id;
    },
    "series.update.snapshots"(_id, arrayOfDataUrls) {
      if (!Meteor.userId() || !tools.isWriteAllowed("series")) {
        throw new Meteor.Error("unauthorized");
      }
      var series = Series.findOne({ _id });
      var extension = ".jpg";
      var date = new Date();
      var code = date.getTime();
      var formattedDate = moment(date).format("YYYY-MM-DD");
      var directory = `user-uploads/images/series
        /${series.description}/${formattedDate}_${code}/`;

      var files = arrayOfDataUrls.map((dataUrl, i) => {
        var name = `series-${_id}-${code}-${i}${extension}`;
        var key = directory + name;
        return {
          dataUrl,
          key,
        };
      });

      return new Promise((resolve, reject) => {
        Meteor.call("aws.write.multiple", files, (err, urls) => {
          if (err) throw new Meteor.Error(err);
          if (urls) {
            var snapshots = series.snapshots;
            snapshots.push({
              date,
              images: urls,
            });
            Series.update({ _id }, { $set: { snapshots } });
            resolve(_id);
          }
        });
      });
    },
    "series.hide"(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed("series")) {
        throw new Meteor.Error("unauthorized");
      }
      var series = Series.findOne({ _id });
      if (series.rented) {
        throw new Meteor.Error("item-must-not-be-rented");
      }
      Series.update({ _id }, { $set: { visible: false } });
      return _id;
    },
  });
}
