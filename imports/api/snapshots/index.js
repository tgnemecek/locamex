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
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      try {
        var Database = DATABASE_SET[item.type];
        var _id = item._id;
        if (!Database) throw new Meteor.Error("type-not-found: " + item.type);

        var snapshots = {
          date: new Date(),
          images: urls
        };
        Database.update({ _id }, { $push: { snapshots } });
        Meteor.call('history.insert', { ...snapshots, _id }, 'snapshot.add');
        return urls;
      }
      catch(err) {
        throw new Meteor.Error(err);
      }
    }
  })
}