import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

export const Modules = new Mongo.Collection('modules');
export const modulesSchema = new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  places: Array,
  'places.$': Object,
  'places.$._id': String,
  'places.$.description': String,
  'places.$.available': SimpleSchema.Integer,
  'places.$.inactive': SimpleSchema.Integer,
  visible: Boolean
})
Modules.attachSchema(modulesSchema);

Modules.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('modulesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('modules')) return [];
    return Modules.find({ visible: true }, {sort: { description: 1 }});
  })

  Meteor.methods({
    'modules.insert'(data) {
      if (!Meteor.userId() || !tools.isWriteAllowed('modules')) {
        throw new Meteor.Error('unauthorized');
      }
      const _id = tools.generateId();
      data = {
        _id,
        type: "module",
        description: data.description,
        rented: 0,
        places: [],
        visible: true
      };
      Modules.insert(data);
      Meteor.call('history.insert', data, 'modules.insert');
      return true;
    },
    'modules.update'(data) {
      if (!Meteor.userId() || !tools.isWriteAllowed('modules')) {
        throw new Meteor.Error('unauthorized');
      }
      Modules.update({ _id: data._id }, { $set: data });
      Meteor.call('history.insert', data, 'modules.update');
      return true;
    },
    'modules.stock.update'(item) {
      if (!Meteor.userId() || !tools.isWriteAllowed('modules')) {
        throw new Meteor.Error('unauthorized');
      }
      const data = {
        place: item.place
      }
      Modules.update({ _id: item._id }, { $set: data });
      Meteor.call('history.insert', {...data, _id: item._id}, 'modules.stock.update');
      return true;
    },
    'modules.shipping.send'(product) {
      if (!Meteor.userId() || !tools.isWriteAllowed('modules')) {
        throw new Meteor.Error('unauthorized');
      }
      var _id = product._id;
      delete product._id;
      Modules.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'modules.shipping.send');
      return true;
    },
    'modules.shipping.receive'(product) {
      if (!Meteor.userId() || !tools.isWriteAllowed('modules')) {
        throw new Meteor.Error('unauthorized');
      }
      var _id = product._id;
      delete product._id;
      Modules.update({ _id }, product);
      Meteor.call('history.insert', {product, _id}, 'modules.shipping.receive');
      return true;
    },
    'modules.hide'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('modules')) {
        throw new Meteor.Error('unauthorized');
      }
      const data = {
        visible: false
      };
      Modules.update({ _id }, { $set: data });
      Meteor.call('history.insert', {...data, _id}, 'modules.hide');
      return true;
    }
  })
}