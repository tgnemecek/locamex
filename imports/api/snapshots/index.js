import { Meteor } from 'meteor/meteor';

import { Accessories } from '../accessories/index';
import { Containers } from '../containers/index';
import { Modules } from '../modules/index';
import { Series } from '../series/index';

if (Meteor.isServer) {
  Meteor.methods({
    'snapshot.add' (metaContext, urls) {
      var Database = null;
      var snapshots = {
        date: new Date(),
        images: urls
      };

      switch (metaContext.type) {
        case 'fixed':
          Database = Series;
        break;
        case 'accessory':
          Database = Accessories;
        break;
        default:
          throw new Meteor.Error('please-add-db-to-snapshots-api');
      }

      Database.update({ _id: metaContext.documentId }, { $push: { snapshots } });
    }
  })
}