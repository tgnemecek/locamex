import { Meteor } from 'meteor/meteor';

import { Accessories } from '../accessories/index';
import { Containers } from '../containers/index';
import { Modules } from '../modules/index';

if (Meteor.isServer) {
  Meteor.methods({
    'snapshot.add' (metaContext, urls) {
      var Database = null;
      var obj = {
        date: new Date(),
        images: urls
      };

      if (metaContext.type === 'fixed') {
        Containers.update(
          { _id: metaContext.documentId, "units._id": metaContext.unitId },
          {$push: { 'units.$.snapshots': obj }}
        );
      } else throw new Meteor.Error('please-add-db-to-snapshots-api');

      // Database.update({ _id }, { $push: { snapshots: obj } });
    }
  })
}