import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

import { Contracts } from '/imports/api/contracts/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';

export const Series = new Mongo.Collection('series');
Series.attachSchema(new SimpleSchema({
  _id: String,
  type: String,
  description: Number,
  rented: Boolean,
  container: Object,
  'container._id': String,
  'container.description': String,
  place: Object,
  'place._id': {
    type: String,
    optional: true
  },
  'place.description': {
    type: String,
    optional: true
  },

  observations: {
    type: String,
    optional: true
  },
  snapshots: Array,
  'snapshots.$': String,
  visible: Boolean
}))

Series.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('seriesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('series')) return [];
    return Series.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'series.insert' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('series')) {
        throw new Meteor.Error('unauthorized');
      }
      var isIdInUse = !!Series.findOne({description: Number(state.description)});
      if (isIdInUse) throw new Meteor.Error('id-in-use');

      var data = {
        description: state.description,
        container: state.container,
        rented: false,
        place: state.place,
        observations: state.observations,
        type: 'series',
        snapshots: [],
        visible: true
      }
      Series.insert(data);
      Meteor.call('history.insert', data, 'series.insert');
      return true;
    },
    'series.update' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('series')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        _id: state._id,
        place: state.place,
        observations: state.observations
      }
      Series.update({_id: state._id}, {$set: data} );
      Meteor.call('history.insert', data, 'series.update');
      return state._id;
    },
    // 'series.update.snapshots' (_id, snapshots) {
    // if (!Meteor.userId() || !tools.isWriteAllowed('series')) {
    //   throw new Meteor.Error('unauthorized');
    // }
    //   snapshots = snapshotsSchema.clean(snapshots);
    //   snapshotsSchema.validate(snapshots);
    //   Series.update({_id: _id}, {$set: snapshots} );
    //   Meteor.call('history.insert', {_id, snapshots}, 'series.update.snapshots');
    //   return _id;
    // },
    'series.delete' (_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('series')) {
        throw new Meteor.Error('unauthorized');
      }
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
