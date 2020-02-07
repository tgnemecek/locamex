import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import updateReferences from '/imports/startup/update-references/index';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';

export const Services = new Mongo.Collection('services');

Services.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('servicesPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Services.find({ visible: true }, {sort: { description: 1 }});
  })

  Meteor.methods({
    'services.insert'(description, price) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const _id = tools.generateId();
      var data = schema('services', 'full').clean({
        _id,
        description,
        price,
        type: "service",
        visible: true
      })
      schema('services', 'full').validate(data);
      Services.insert(data);
      Meteor.call('history.insert', data, 'services');
    },
    'services.hide'(_id) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const data = {
        visible: false
      }
      schema('services', 'hide').validate(data);
      Services.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'services');
    },
    'services.update'(_id, description, price) {
      if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
      const data = schema('services', 'update').clean({
        description,
        price
      })
      schema('services', 'update').validate(data);
      Services.update({ _id }, { $set: data });
      updateReferences(_id, 'services', {
        ...data,
        price: undefined
      });
      Meteor.call('history.insert', data, 'services');
      return true;
    }
  })
}