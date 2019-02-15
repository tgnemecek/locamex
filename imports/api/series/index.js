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
      var _id = tools.generateId();
      var data = {
        _id,
        model: state.model,
        serial: state.serial,
        place: state.place,
        observations: state.observations,
        type: 'fixed',

        snapshots: [],
        visible: true
      }
      Series.insert(data);
      Meteor.call('history.insert', data, 'series.insert');
    },
    'series.update' (state) {
      var data = {
        model: state.model,
        serial: state.serial,
        place: state.place,
        observations: state.observations
      }
      Series.update({_id: state._id}, data);
      Meteor.call('history.insert', {...data, _id: state._id}, 'series.update');
    }
  })
}
