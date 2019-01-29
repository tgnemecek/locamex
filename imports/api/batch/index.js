import tools from '/imports/startup/tools/index';

import { Accessories } from '/imports/api/accessories/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { History } from '/imports/api/history/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Places } from '/imports/api/places/index';
import { Services } from '/imports/api/services/index';

if (Meteor.isServer && Meteor.isDevelopment) {
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