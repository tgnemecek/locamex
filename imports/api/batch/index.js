import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

import { Accessories } from '/imports/api/accessories/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { History } from '/imports/api/history/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Places } from '/imports/api/places/index';
import { Services } from '/imports/api/services/index';

const Batch = new Mongo.Collection('batch');

if (Meteor.isServer) {
  Meteor.methods({
    'batch.insert'(observations) {
      Batch.insert({
        insertionDate: new Date(),
        observations
      })
    }
  })

  // EXEMPLO:
  

  // const batchCollections = () => {
  //   var currentBatch = Batch.find().count();
  //
  //   // currentBactch is an index used to identify if the current database needs to run the batch code.
  //   // If the currentBatch matches, it means the database is outdated.
  //   if (currentBatch === 0) {
  //     var arrayOfCollections = [Accessories, Clients, Containers, History, Modules, Packs, Places, Services];
  //
  //     arrayOfCollections.forEach((Collection, i) => {
  //       var database = Collection.find().fetch();
  //       Collection.remove({});
  //       database.forEach((item) => {
  //         delete item._id;
  //         Collection.insert(item);
  //       })
  //     })
  //     Meteor.call('batch.insert', 'Removed prefix from all _ids from all collections', () => batchCollections());
  //   }
  // }
  // batchCollections();
}