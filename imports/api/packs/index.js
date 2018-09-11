import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';

export const Packs = new Mongo.Collection('packs');

if (Meteor.isServer) {

  Meteor.publish('packsPub', () => {
    return Packs.find();
  })
  //
  // Packs.remove({});
  //
  // Packs.insert({
  //   _id: "0000",
  //   containerId: "0000",
  //   description: "Loca 600 D Black",
  //   price: "",
  //   modules: [
  //     {_id: "0001", quantity: 5, description: "Coluna X"},
  //     {_id: "0002", quantity: 5, description: "Coluna X"},
  //     {_id: "0003", quantity: 5, description: "Coluna X"},
  //     {_id: "0004", quantity: 5, description: "Coluna X"},
  //     {_id: "0005", quantity: 5, description: "Coluna X"},
  //     {_id: "0006", quantity: 5, description: "Coluna X"},
  //     {_id: "0007", quantity: 5, description: "Coluna X"},
  //     {_id: "0008", quantity: 5, description: "Coluna X"},
  //     {_id: "0009", quantity: 5, description: "Coluna X"},
  //     {_id: "0010", quantity: 5, description: "Coluna X"},
  //     {_id: "0011", quantity: 5, description: "Coluna X"},
  //     {_id: "0012", quantity: 5, description: "Coluna X"},
  //     {_id: "0013", quantity: 5, description: "Coluna X"},
  //     {_id: "0014", quantity: 5, description: "Coluna X"},
  //     {_id: "0015", quantity: 5, description: "Coluna X"}
  //   ],
  //   place: "0005",
  //   visible: true
  // });

  Meteor.methods({
    'packs.insert' (packInfo) {
      var maxIterations = packInfo.selectedAssembled;
      for (var i = 0; i < maxIterations; i++) {
        var _id = tools.generateId(Packs);
        var modules = packInfo.modules;
        var data = {
          ...packInfo,
          _id,
          modules,
          selectedAssembled: undefined,
          visible: true
        }
        Packs.insert(data);
        Meteor.call('containers.update.assembled', packInfo.containerId, 1);
        Meteor.call('history.insert', data, 'packs.insert');
      }
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