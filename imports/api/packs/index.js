import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Packs = new Mongo.Collection('packs');

if (Meteor.isServer) {
  Meteor.publish('packsPub', () => {
    return Packs.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    'packs.insert' (packInfo) {
      var maxIterations = packInfo.selectedAssembled;
      for (var i = 0; i < maxIterations; i++) {
        var _id = tools.generateId();
        var modules = [];
        packInfo.modules.forEach((module) => {
          if (module.renting) modules.push(module);
        })
        var data = {
          _id,
          description: packInfo.description,
          type: 'pack',
          status: "available",
          modules,
          place: packInfo.place,
          price: packInfo.defaultPrice,
          restitution: packInfo.restitution,
          assembled: packInfo.assembled,
          visible: true
        }
        Packs.insert(data);
        Meteor.call('containers.update.assembled', packInfo.containerId, 1);
        Meteor.call('history.insert', data, 'packs.insert');
      }
    },
    'packs.transaction'(state) {
      const data = {
        _id: state._id,
        status: state.status,
        place: state.place
      }
      Packs.update({ _id: state._id }, { $set: data });
      Meteor.call('history.insert', data, 'packs');
    },
    'packs.check'(_id) {
      const item = Packs.findOne(
        {
          $and: [
            { _id },
            { visible: true }
          ]
        }
      );
      if (!item) throw new Meteor.Error("_id-not-found", "Um dos pacotes locados não está mais disponível ou foi excluído.", arguments);
      if (item.status == 'available') {
        return true;
      } else return false;
    },
    'packs.rent' (_id) {
      Packs.remove({ _id });
      Meteor.call('history.insert', _id, 'packs.rent');
    },
    'packs.unmount' (pack) {
      var _id = pack._id;
      var data = {
        ...pack,
        visible: false
      }
      Packs.update({ _id }, { $set: data });
      Meteor.call('modules.receive', pack.modules);
      Meteor.call('containers.update.assembled', pack.containerId, -1);
      Meteor.call('history.insert', data, 'packs.unmount');
    },
    'packs.update'(pack) {
      const data = {
        place: pack.place
      };
      Packs.update({ _id: pack._id }, { $set: data });
      Meteor.call('history.insert', data, 'packs.update');
    }
  })
}