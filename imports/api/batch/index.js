import tools from '/imports/startup/tools/index';

import { Accessories } from '/imports/api/accessories/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { History } from '/imports/api/history/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Places } from '/imports/api/places/index';
import { Services } from '/imports/api/services/index';
import { Series } from '/imports/api/series/index';

if (Meteor.isServer && Meteor.isDevelopment) {
  // var a = Accessories.find().fetch();
  //
  // a.forEach((item) => {
  //   item.variations.forEach((variation) => {
  //     variation.rented = 0;
  //   })
  //   Accessories.update({_id: item._id}, {$set: {variations: item.variations}})
  // })
  // var services = Services.find().fetch();
  // Services.remove({});
  //
  // services.forEach((service) => {
  //   service._id = tools.generateId();
  //   Services.insert(service);
  // })
  // var series = Series.find().fetch();
  //
  // Series.remove({});
  //
  // series.forEach((item) => {
  //   item._id = item.serial.toString();
  //   delete item.serial;
  //   console.log(item);
  //   Series.insert(item);
  // })
  //
  // Modules.update({}, {$set: {
  //   snapshots: []
  // }}, {multi: 1});

  // var a = Accessories.find().fetch();
  //
  // Accessories.remove({});
  //
  // a.forEach((item) => {
  //   delete item._id;
  //   Accessories.insert(item);
  // })

  // Accessories.update({}, {$set: {
  //   type: "accessory"
  // }}, {multi: 1});

  // var series = Series.find().fetch();
  //
  // series.forEach((item) => {
  //   Series.update({_id: item._id}, {$set: { type: "fixed" }});
  // });

  // var containers = Containers.find().fetch();
  //
  // containers.forEach((container) => {
  //   Containers.update({_id: container._id}, {$unset: {units:1}}, {multi: true});
  // })



  // var containers = Containers.find().fetch();
  // var series = Series.find().fetch();
  //
  // series.forEach((item) => {
  //   for (var i = 0; i < containers.length; i++) {
  //     if (containers[i].description === item.model) {
  //       Series.update({_id: item._id}, {$set: {model: containers[i]._id} });
  //       break;
  //     }
  //   }
  // })



  // containers.forEach((container) => {
  //   // if (container.units) {
  //   //   container.units.forEach((unit) => {
  //   //     unit.model = container.description;
  //   //     Series.insert(unit);
  //   //   })
  //   // }
  //   Series.update({ model: container.description }, { model: container._id });
  // })

  // // Use meteor debug for bebugger to work!
  // debugger;
  //
  // var modules = Modules.find().fetch();
  // var containers = Containers.find().fetch();
  //
  // var backModules = tools.deepCopy(modules);
  // var backContainers = tools.deepCopy(containers);
  //
  // const restore = (type) => {
  //   if (type === 'modules') {
  //     Modules.remove({});
  //     backModules.forEach((item) => {
  //       Modules.insert(item);
  //     })
  //   } else {
  //     Containers.remove({});
  //     backContainers.forEach((item) => {
  //       Containers.insert(item);
  //     })
  //   }
  // }
  //
  // var dictionary = {};
  //
  // Modules.remove({});
  // Containers.remove({});
  //
  // modules.forEach((module) => {
  //   var oldId = module._id;
  //   var newId = new Meteor.Collection.ObjectID()._str;
  //   module._id = newId;
  //   dictionary[oldId] = newId;
  //   Modules.insert(module);
  // })
  //
  // containers.forEach((container, i) => {
  //   if (container.type === 'modular') {
  //     var modules = tools.deepCopy(container.modules);
  //     for (var j = 0; j < modules.length; j++) {
  //       modules[j] = dictionary[modules[j]];
  //     }
  //     container.modules = modules;
  //   }
  //   delete container._id;
  //
  //   Containers.insert(container);
  // })

  // Modules.remove({});
  // Containers.remove({});
  //
  // modules.forEach((module) => {
  //   var newId = new Meteor.Collection.ObjectID()._str;
  //   containers.forEach((container) => {
  //     if (container.modules) {
  //       for (var i = 0; i < container.modules.length; i++) {
  //         if (container.modules[i] === module._id) {
  //           container.modules[i] = newId;
  //         }
  //       }
  //     }
  //     Containers.insert(container);
  //   })
  //   Modules.insert({...module, _id: newId});
  // })
}