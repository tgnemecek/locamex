import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Modules = new Mongo.Collection('modules');

if (Meteor.isServer) {
  Meteor.publish('modulesPub', () => {
    return Modules.find();
  })

  Meteor.methods({
    'modules.insert'(state) {
      const _id = tools.generateId("modules");
      const data = {
        _id,
        description: state.description,
        available: state.available || 0,
        rented: state.rented || 0,
        maintenance: state.maintenance || 0,
        visible: true
      };
      Modules.insert(data);
      Meteor.call('history.insert', data, 'modules');
    },
    'modules.hide'(_id) {
      const data = {
        _id,
        visible: false
      };
      Modules.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'modules');
    },
    'modules.check'(_id, quantity) {
      const item = Modules.findOne(_id);
      if (!item) throw new Meteor.Error("_id-not-found", "Erro de banco de dados", arguments);
      if (item.available < quantity) {
        return false;
      } else return true;
    },
    'modules.rent' (modules) {
      var data = [];
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].quantity == 0) continue;
        var changes = {
          available: -modules[i].quantity,
          rented: modules[i].quantity
        }
        Modules.update({ _id: modules[i]._id }, { $inc: changes });
        if (!data.includes(modules[i])) data.push(modules[i]);
        Meteor.call('history.insert', data, 'modules.rent');
      }
    },
    'modules.receive' (modules) {
      var data = [];
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].quantity == 0) continue;
        var changes = {
          available: modules[i].quantity,
          rented: -modules[i].quantity
        }
        Modules.update({ _id: modules[i]._id }, { $inc: changes });
        if (!data.includes(modules[i])) data.push(modules[i]);
        Meteor.call('history.insert', data, 'modules.receive');
      }
    },
    'modules.update'(state) {
      const data = {
        _id: state._id,
        description: state.description,
        available: state.available || 0,
        rented: state.rented || 0,
        maintenance: state.maintenance || 0,
        visible: true
      };
      Modules.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'modules');
    }
  })
}