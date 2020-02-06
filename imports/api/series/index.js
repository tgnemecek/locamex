import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';

import { Contracts } from '/imports/api/contracts/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';

export const Series = new Mongo.Collection('series');

Series.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('seriesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Series.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'series.insert' (state) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      var isIdInUse = !!Series.findOne({_id: state._id});
      if (isIdInUse) throw new Meteor.Error('id-in-use');

      var container = Containers.findOne({_id: state.containerId});
      var containerDescription = container.description || 'Alugado';

      var data = schema('series', 'full').clean({
        _id: state._id,
        containerId: state.containerId,
        containerDescription,
        placeId: state.placeId,
        placeDescription: Places.findOne({_id: state.placeId}).description,
        observations: state.observations,
        type: 'series',
        snapshots: [],
        visible: true
      })
      schema('series', 'full').validate(data);
      Series.insert(data);
      Meteor.call('history.insert', data, 'series.insert');
      return true;
    },
    'series.update' (changes, _id) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      changes.placeDescription = Places.findOne({
        _id: changes.placeId
      }).description,
      changes = schema('series', 'update').clean(changes);
      schema('series', 'update').validate(changes);
      Series.update({_id: _id}, {$set: changes} );
      Meteor.call('history.insert', {_id, changes}, 'series.update');
      return _id;
    },
    // 'series.update.snapshots' (_id, snapshots) {
    // if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    //   snapshots = snapshotsSchema.clean(snapshots);
    //   snapshotsSchema.validate(snapshots);
    //   Series.update({_id: _id}, {$set: snapshots} );
    //   Meteor.call('history.insert', {_id, snapshots}, 'series.update.snapshots');
    //   return _id;
    // },
    'series.delete' (_id) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      // This function is temporarily disabled
      // After Shipping module is complete, this must be enabled
      // It should look into shipping property in contracts and
      // verify if the series is in one of them.
      // If found, the function should fail
      //
      // var contracts = Contracts.find({}).fetch();
      // var found = contracts.find((master) => {
      //   return master.snapshots.find((snapshot) => {
      //     return snapshot.containers.find((container) => {
      //       return container.productId === _id;
      //     })
      //   })
      // })
      // if (found) {
      //   var reason = "Contrato: " + found._id;
      //   throw new Meteor.Error('id-in-use', reason);
      // }
      Series.remove({ _id });
      return _id;
    }
  })
}
