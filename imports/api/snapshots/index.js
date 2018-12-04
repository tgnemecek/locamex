import { Meteor } from 'meteor/meteor';

import { Containers } from '../containers/index';

if (Meteor.isServer) {
  Meteor.methods({
    'snapshot.add' (itemType, _id, urls) {
      var Database = null;
      var obj = {};
      if (itemType == 'containers') {
        Database = Containers;
      }

      obj = {
        date: new Date(),
        images: urls
      }

      Database.update({ _id }, { $push: { snapshots: obj } });

    }
  })
}