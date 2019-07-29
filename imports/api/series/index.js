import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Series = new Mongo.Collection('series');

if (Meteor.isServer) {
  Meteor.publish('seriesPub', () => {
    return Series.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'series.insert' (state) {

      var isIdInUse = !!Series.find({_id: state._id}).fetch().length;
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
      Meteor.call('history.insert', changes, 'series.update');
    },
    'series.hide' (_id) {
      var data = { visible: false };
      Series.update({_id}, {$set: data} );
      Meteor.call('history.insert', {...data, _id}, 'series.hide');
    }
  })
}
