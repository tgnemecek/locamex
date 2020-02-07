import moment from 'moment';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';

import { Accessories } from '/imports/api/accessories/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { Contracts } from '/imports/api/contracts/index';
import { History } from '/imports/api/history/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Places } from '/imports/api/places/index';
import { Proposals } from '/imports/api/proposals/index';
import { Services } from '/imports/api/services/index';
import { Series } from '/imports/api/series/index';

if (Meteor.isServer) {
  // Migrations.add({
  //   version: 2,
  //   name: "Adapt Users to SimpleSchema",
  //   up: function() {
  //     var users = Meteor.users.find({}).fetch();
  //     users.forEach((user) => {
  //       var _id = user._id;
  //       var newUser = {
  //         ...user,
  //         profile: {
  //           firstName: user.firstName,
  //           lastName: user.lastName,
  //           type: user.type
  //         }
  //       }
  //       delete newUser.firstName;
  //       delete newUser.lastName;
  //       delete newUser.type;
  //       delete newUser.pages;
  //       delete newUser._id;
  //
  //       schema('users', 'insert').validate(newUser);
  //
  //       Meteor.users.update({ _id }, newUser);
  //     })
  //   },
  //   down: function() {}
  // });
  // Migrations.add({
  //   version: 1,
  //   name: "Adapt Accessories to SimpleSchema",
  //   up: function() {
  //     Accessories.update(
  //       {},
  //       {
  //         $unset: {place: "", rented: ""}
  //       },
  //       {multi: true}
  //     )
  //     Accessories.update(
  //       {images: {$exists: false}},
  //       {
  //         $set: {images: []}
  //       },
  //       {multi: true}
  //     )
  //     var acc = Accessories.find().fetch();
  //     acc.forEach((item) => {
  //       item.variations.forEach((variation, i, arr) => {
  //         if (!variation._id) {
  //           variation._id = tools.generateId();
  //         }
  //         var description = "Padrão Único";
  //         if (arr.length > 1) {
  //           description = "Padrão " + tools.convertToLetter(i);
  //         }
  //         variation.description = description;
  //       })
  //       var _id = item._id;
  //       delete item._id;
  //       Accessories.update({_id}, item);
  //     })
  //   },
  //   down: function() {}
  // });
}