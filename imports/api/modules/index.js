import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Modules = new Mongo.Collection('modules');

if (Meteor.isServer) {
  Meteor.publish('modulesPub', () => {
    return Modules.find({ visible: true }, {sort: { description: 1 }});
  })

  Meteor.methods({
    'modules.insert'(state) {
      const _id = tools.generateId();
      const data = {
        _id,
        type: "module",
        description: state.description,
        rented: 0,
        place: [],

        snapshots: [],

        visible: true
      };
      Modules.insert(data);
      Meteor.call('history.insert', data, 'modules.insert');
    },
    'modules.update'(state) {
      const data = {
        description: state.description
      };
      Modules.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', {...data, _id: state._id}, 'modules.update');
    },
    'modules.stock.update'(item) {
      const data = {
        place: item.place
      }
      Modules.update({ _id: item._id }, { $set: data });
      Meteor.call('history.insert', {...data, _id: item._id}, 'modules.stock.update');
    },
    'modules.hide'(_id) {
      const data = {
        visible: false
      };
      Modules.update({ _id }, { $set: data });
      Meteor.call('history.insert', {...data, _id}, 'modules.hide');
    }
  })
}