import { Mongo } from "meteor/mongo";
import { version } from "/package.json";

import { Accessories } from "/imports/api/accessories/index";
import { Accounts } from "/imports/api/accounts/index";
import { Events } from "/imports/api/events/index";
import { Clients } from "/imports/api/clients/index";
import { Containers } from "/imports/api/containers/index";
import { Contracts } from "/imports/api/contracts/index";
import { Modules } from "/imports/api/modules/index";
import { Packs } from "/imports/api/packs/index";
import { Places } from "/imports/api/places/index";
import { Proposals } from "/imports/api/proposals/index";
import { Series } from "/imports/api/series/index";
import { Services } from "/imports/api/services/index";
import { Settings } from "/imports/api/settings/index";
import { Variations } from "/imports/api/variations/index";

import tools from "/imports/startup/tools/index";

export const History = new Mongo.Collection("history");

function afterInsert(userId, doc) {
  var user = Meteor.user();
  History.insert({
    _id: tools.generateId(),
    user: {
      _id: user._id,
      profile: user.profile,
    },
    date: new Date(),
    doc,
    version,
    hook: "insert",
  });
}

function afterUpdate(userId, doc, modifier, options) {
  var user = Meteor.user() || {};
  History.insert({
    _id: tools.generateId(),
    user: {
      _id: user._id,
      profile: user.profile,
    },
    date: new Date(),
    doc,
    previous: this.previous,
    modifier,
    version,
    hook: "update",
  });
}

[
  Accessories,
  Accounts,
  Clients,
  Containers,
  Contracts,
  Events,
  Modules,
  Packs,
  Places,
  Proposals,
  Series,
  Services,
  Settings,
  Meteor.users,
  Variations,
].forEach((Collection) => {
  Collection.after.insert(afterInsert);
  Collection.after.update(afterUpdate);
});

History.deny({
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
  Meteor.publish("historyPub", (limit) => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("history")) return [];
    return History.find(
      {},
      {
        sort: { date: -1 },
        limit: limit || 0,
      }
    );
  });
}
