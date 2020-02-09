import { Meteor } from 'meteor/meteor';

import { Accessories } from '../accessories/index';
import { Modules } from '../modules/index';
import { Series } from '../series/index';

var DATABASE_SET = {
  series: Series,
  accessory: Accessories,
  module: Modules
}

if (Meteor.isServer) {
  Meteor.methods({
    'snapshot.add' (item, urls) {
      // ADD THIS LATER:
      // if (!Meteor.userId() || !tools.isWriteAllowed('services')) {
      //   throw new Meteor.Error('unauthorized');
      // }
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var Database = DATABASE_SET[item.type];
      var _id = item._id;
      if (!Database) {
        throw new Meteor.Error("type-not-found: " + item.type);
      }

      var snapshot = {
        date: new Date(),
        images: urls
      };
      var data = Database.findOne({ _id });
      data.snapshots.push(snapshot);

      Database.update({ _id }, { $set: data });
      Meteor.call('history.insert', { ...snapshots, _id }, 'snapshot.add');
      return urls;
    }
  })
}