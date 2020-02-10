import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Services = new Mongo.Collection('services');
export const servicesSchema = new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  price: Number,
  renting : {
    type: SimpleSchema.Integer,
    optional: true
  },
  visible: Boolean
})
Services.attachSchema(servicesSchema);

Services.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('servicesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('services')) return [];
    return Services.find({ visible: true }, {sort: { description: 1 }});
  })

  Meteor.methods({
    'services.insert'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('services')) {
        throw new Meteor.Error('unauthorized');
      }
      const _id = tools.generateId();
      var data = {
        _id,
        description: state.description,
        price: state.price,
        type: "service",
        visible: true
      }
      Services.insert(data);
      Meteor.call('history.insert', data, 'services');
      return true;
    },
    'services.hide'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('services')) {
        throw new Meteor.Error('unauthorized');
      }
      const data = {
        visible: false
      }
      schema('services', 'hide').validate(data);
      Services.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'services');
      return true;
    },
    'services.update'(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('services')) {
        throw new Meteor.Error('unauthorized');
      }
      const data = {
        _id: state._id,
        description: state.description,
        price: state.price
      }
      Services.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'services');
      return true;
    }
  })
}