import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

import { Contracts } from '/imports/api/contracts/index';

export const Series = new Mongo.Collection('series');

Series.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('seriesPub', () => {
    return Series.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'series.insert' (state) {

      var isIdInUse = !!Series.findOne({_id: state._id});
      if (isIdInUse) throw new Meteor.Error('id-in-use');

      var data = {
        _id: state._id,
        containerId: state.containerId,
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
    'series.update' (changes, _id) {
      Series.update({_id: _id}, {$set: changes} );
      Meteor.call('history.insert', {_id, changes}, 'series.update');
    },
    'series.delete' (_id) {
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
    },
    'series.hide' (_id) {
      var data = { visible: false };
      Series.update({_id}, {$set: data} );
      Meteor.call('history.insert', {...data, _id}, 'series.hide');
    }
  })
}
