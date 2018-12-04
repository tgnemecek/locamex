import { Meteor } from 'meteor/meteor';

import { Accessories } from '../accessories/index';
import { Containers } from '../containers/index';
import { Modules } from '../modules/index';

if (Meteor.isServer) {
  Meteor.methods({
    'snapshot.add' (itemType, _id, urls) {
      var Database = null;
      var obj = {};
      if (itemType == 'accessories') {
        Database = Accessories;
      } else if (itemType == 'containers') {
        Database = Containers;
      } else if (itemType == 'modules') {
        Database = Modules;
      }

      obj = {
        date: new Date(),
        images: urls
      }

      Database.update({ _id }, { $push: { snapshots: obj } });

    }
  })
}