import { Mongo } from 'meteor/mongo';
import { version } from '/package.json';

import { Accessories } from '/imports/api/accessories/index';
import { Accounts } from '/imports/api/accounts/index';
import { Agenda } from '/imports/api/agenda/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { Contracts } from '/imports/api/contracts/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Places } from '/imports/api/places/index';
import { Proposals } from '/imports/api/proposals/index';
import { Series } from '/imports/api/series/index';
import { Services } from '/imports/api/services/index';
import { Settings } from '/imports/api/settings/index';
import { Variations } from '/imports/api/variations/index';

import tools from '/imports/startup/tools/index';

export const History = new Mongo.Collection('history');

function afterInsert(userId, doc) {
  var user = Meteor.user();
  History.insert({
    _id: tools.generateId(),
    user: {
      _id: user._id,
      profile: user.profile
    },
    date: new Date(),
    doc,
    version,
    hook: 'insert'
  })
}

function afterUpdate(userId, doc, modifier, options) {
  var user = Meteor.user() || {};
  History.insert({
    _id: tools.generateId(),
    user: {
      _id: user._id,
      profile: user.profile
    },
    date: new Date(),
    doc,
    previous: this.previous,
    modifier,
    version,
    hook: 'update'
  })
}

Accessories.after.insert(afterInsert)
Accessories.after.update(afterUpdate)
Accounts.after.insert(afterInsert)
Accounts.after.update(afterUpdate)
Agenda.after.insert(afterInsert)
Agenda.after.update(afterUpdate)
Clients.after.insert(afterInsert)
Clients.after.update(afterUpdate)
Containers.after.insert(afterInsert)
Containers.after.update(afterUpdate)
Contracts.after.insert(afterInsert)
Contracts.after.update(afterUpdate)
Modules.after.insert(afterInsert)
Modules.after.update(afterUpdate)
Packs.after.insert(afterInsert)
Packs.after.update(afterUpdate)
Places.after.insert(afterInsert)
Places.after.update(afterUpdate)
Proposals.after.insert(afterInsert)
Proposals.after.update(afterUpdate)
Series.after.insert(afterInsert)
Series.after.update(afterUpdate)
Services.after.insert(afterInsert)
Services.after.update(afterUpdate)
Settings.after.insert(afterInsert)
Settings.after.update(afterUpdate)
Meteor.users.after.insert(afterInsert)
Meteor.users.after.update(afterUpdate)
Variations.after.insert(afterInsert)
Variations.after.update(afterUpdate)

History.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('historyPub', (limit) => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('history')) return [];
    return History.find({}, {
      sort: { date: -1 },
      limit: limit || 0
    });
  })
}