import moment from 'moment';
import tools from '/imports/startup/tools/index';

import { Accessories } from '/imports/api/accessories/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { Contracts } from '/imports/api/contracts/index';
import { History } from '/imports/api/history/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Places } from '/imports/api/places/index';
import { Proposals } from '/imports/api/proposals/index';
import { Services } from '/imports/api/services/index';
import { Series } from '/imports/api/series/index';

if (Meteor.isServer && Meteor.isDevelopment) {

  // var accessories = Accessories.find().fetch();
  // var datas = [];
  // Accessories.remove({});
  //
  // accessories.forEach((s, index) => {
  //   if (Array.isArray(s.snapshots)) {
  //     var snapshot;
  //     var code;
  //     if (s.snapshots.length) {
  //       snapshot = s.snapshots[s.snapshots.length-1].images;
  //       s.images = snapshot.map((image, i) => {
  //
  //         var prefix = "https://locamex-app.s3-sa-east-1.amazonaws.com/";
  //         var oldKey = image.replace(prefix, "");
  //         oldKey = "backup/" + oldKey;
  //
  //         var date = oldKey.match(/2019-\d\d-\d\d_\d*/g)[0];
  //         if (i === 0) {
  //           code = date.split("_")[1];
  //         }
  //
  //         date = date.replace(date.split("_")[1], code);
  //
  //         var substring = oldKey.split(".");
  //         var extension = substring[substring.length-1].toLowerCase();
  //
  //         var filename = `img-accessory-${s._id}-${i}.jpg`
  //
  //
  //         var newKey = `user-uploads/images/accessories/${s._id}/${filename}`;
  //         var url = prefix + newKey;
  //         datas.push({
  //           oldKey,
  //           newKey
  //         });
  //         return url;
  //       })
  //     } else s.images = [];
  //   } else s.images = [];
  //   delete s.snapshots;
  //   Accessories.insert(s);
  // })
  //
  // var promises = datas.map((data, i, arr) => {
  //   console.log("Started Copy " + (i+1) + "/" + arr.length);
  //   return Meteor.call('aws.changeKey', data.oldKey, data.newKey);
  // })
  //
  // Promise.all(promises).then(() => {
  //   console.log("done!!!!");
  // })

  // -------------------------------------------


  // var accessories = Accessories.find().fetch();
  // var datas = [];
  // Accessories.remove({});
  //
  // accessories.forEach((s, index) => {
  //   var code;
  //   if (Array.isArray(s.images)) {
  //     s.images = s.snapshots.map((image, i) => {
  //
  //       var prefix = "https://locamex-app.s3-sa-east-1.amazonaws.com/";
  //       var oldKey = image.replace(prefix, "");
  //
  //       var date = oldKey.match(/2019-\d\d-\d\d_\d*/g)[0];
  //       if (i === 0) {
  //         code = date.split("_")[1];
  //       }
  //
  //       var substring = oldKey.split(".");
  //       var extension = substring[substring.length-1].toLowerCase();
  //
  //       var filename = `img-accessory-${s._id}-${code}-${i}.${extension}`
  //
  //
  //       var newKey = `user-uploads/images/accessories/${s._id}/${date}/${filename}`;
  //       var url = prefix + newKey;
  //       datas.push({
  //         oldKey,
  //         newKey
  //       });
  //       return url;
  //     })
  //   } else s.images = [];
  //   Accessories.insert(s);
  // })
  //
  // var promises = datas.map((data, i, arr) => {
  //   console.log("Started Copy " + (i+1) + "/" + arr.length);
  //   return Meteor.call('aws.changeKey', data.oldKey, data.newKey);
  // })
  //
  // Promise.all(promises).then(() => {
  //   console.log("done!!!!");
  // })

  // var docs = Contracts.find().fetch();
  //
  // Contracts.remove({});
  //
  // docs.forEach((doc) => {
  //   var newDoc = {
  //     _id: doc._id,
  //     status: doc.status,
  //     activeVersion: 0,
  //     shipping: doc.shipping,
  //     proposal: doc.proposal,
  //     proposalVersion: Number(doc.proposalVersion),
  //     snapshots: [
  //       {
  //         createdBy: doc.createdBy,
  //         clientId: doc.clientId,
  //         discount: doc.discount,
  //         observations: doc.observations,
  //         deliveryAddress: doc.deliveryAddress,
  //         dates: doc.dates,
  //         containers: doc.containers,
  //         accessories: doc.accessories,
  //         services: doc.services,
  //         billingProducts: doc.billingProducts,
  //         billingServices: doc.billingServices,
  //         inss: doc.inss,
  //         iss: doc.iss
  //       }
  //     ]
  //   }
  //   Contracts.insert(newDoc);
  // })



  // var c = Contracts.find().fetch();
  // Contracts.remove({});
  //
  // c.forEach((doc) => {
  //   var oldId = doc.proposalVersion;
  //   var newId = oldId === undefined ? 1 : oldId;
  //   Contracts.insert({
  //     ...doc,
  //     proposalVersion: newId
  //   })
  // })
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