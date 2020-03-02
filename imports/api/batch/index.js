import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';

import { Accounts } from '/imports/api/accounts/index';
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
import { Variations } from '/imports/api/variations/index';

if (Meteor.isServer && Meteor.isDevelopment) {
  // // MIGRATION TO VERSION 3.0 -------------------
  // var items;
  // var errors = []
  // var uniqueErrors = []
  // const errorHandling = (err, item) => {
  //   console.dir(item, {depth: null});
  //   if (!err.details) throw err;
  //   err.details.forEach((key) => {
  //     // var identifier = item.type + ": " + key.name;
  //     var identifier = key.name;
  //     if (!uniqueErrors.includes(identifier)) {
  //       uniqueErrors.push(identifier);
  //       errors.push(err.details[0].name, item.description);
  //     }
  //   })
  // }
  //
  // // MAIN FUNCTIONS
  // const createVariations = (simulation) => {
  //   var items = Accessories.find().fetch();
  //   items.forEach((item) => {
  //     try {
  //       item.variations.forEach((variation) => {
  //         var newItem = {
  //           ...variation,
  //           _id: tools.generateId(),
  //           type: "variation",
  //           place: undefined,
  //           places: [],
  //           accessory: {
  //             _id: item._id,
  //             description: item.description
  //           }
  //         }
  //         if (simulation) {
  //           newItem = Variations.simpleSchema().clean(newItem);
  //           Variations.simpleSchema().validate(newItem);
  //         } else {
  //           Variations.insert(newItem);
  //         }
  //       })
  //     }
  //     catch(err) {
  //       errorHandling(err, item)
  //     }
  //   })
  // }
  //
  // const updateContainers = (simulation) => {
  //   var items = Containers.find().fetch();
  //   Containers.remove({});
  //   items.forEach((item) => {
  //     try {
  //       var allowedModules = undefined;
  //       if (item.type === "modular") {
  //         if (!item.allowedModules) {
  //           allowedModules = [];
  //         } else {
  //           allowedModules = item.allowedModules.map((moduleId, i) => {
  //             var module = Modules.findOne({_id: moduleId});
  //             return {
  //               _id: module._id,
  //               description: module.description
  //             }
  //           })
  //         }
  //       }
  //       var newItem = {
  //         ...item,
  //         allowedModules,
  //         units: undefined,
  //         containerId: undefined,
  //         flyer: item.flyer || undefined
  //       };
  //       if (simulation) {
  //         newItem = Containers.simpleSchema().clean(newItem);
  //         Containers.simpleSchema().validate(newItem);
  //       } else {
  //         Containers.insert(newItem)
  //       }
  //     }
  //     catch(err) {
  //       errorHandling(err, newItem);
  //     }
  //   })
  // }
  //
  // const updateSeries = (simulation) => {
  //   var items = Series.find().fetch();
  //   Series.remove({});
  //   items.forEach((item) => {
  //     try {
  //       var place = Places.findOne({_id: item.place});
  //       var container = Containers.findOne({_id: item.containerId});
  //       if (!place) throw new Meteor.Error('place-not-found', '', item)
  //
  //       var newItem = {
  //         ...item,
  //         _id: tools.generateId(),
  //         description: item._id,
  //         containerId: undefined,
  //         container: {
  //           _id: container._id,
  //           description: container.description
  //         },
  //         rented: place._id === "aa59b7acc6fd6ca00265cc50",
  //         place: {
  //           _id: place._id,
  //           description: place.description
  //         }
  //       }
  //       if (simulation) {
  //         newItem = Series.simpleSchema().clean(newItem);
  //         Series.simpleSchema().validate(newItem);
  //       } else {
  //         Series.insert(newItem);
  //       }
  //     }
  //     catch(err) {
  //       errorHandling(err, newItem);
  //     }
  //   })
  // }
  //
  // const updateAccessories = (simulation) => {
  //   var items = Accessories.find().fetch();
  //   Accessories.remove({});
  //   items.forEach((item) => {
  //     try {
  //       var newItem = {
  //         ...item,
  //         available: 0,
  //         inactive: 0,
  //         rented: 0
  //       };
  //       if (simulation) {
  //         newItem = Accessories.simpleSchema().clean(newItem);
  //         Accessories.simpleSchema().validate(newItem);
  //       } else {
  //         Accessories.insert(newItem)
  //       }
  //     }
  //     catch(err) {
  //       errorHandling(err, newItem);
  //     }
  //   })
  // }
  //
  // const updateModules = (simulation) => {
  //   var items = Modules.find().fetch();
  //   Modules.remove({});
  //   items.forEach((item) => {
  //     try {
  //       var newItem = {
  //         ...item,
  //         places: []
  //       };
  //       if (simulation) {
  //         Modules.simpleSchema().validate(newItem);
  //       } else {
  //         Modules.insert(newItem);
  //       }
  //     }
  //     catch(err) {
  //       errorHandling(err, newItem);
  //     }
  //   })
  // }
  //
  // const updateServices = (simulation) => {
  //   var items = Services.find().fetch();
  //   Services.remove({});
  //   items.forEach((item) => {
  //     try {
  //       var newItem = {
  //         ...item,
  //         price: item.price || 0
  //       };
  //       if (simulation) {
  //         newItem = Services.simpleSchema().clean(newItem);
  //         Services.simpleSchema().validate(newItem);
  //       } else {
  //         Services.insert(newItem)
  //       }
  //     }
  //     catch(err) {
  //       errorHandling(err, newItem);
  //     }
  //   })
  // }
  //
  // const updateClients = (simulation) => {
  //   var items = Clients.find().fetch();
  //   Clients.remove({});
  //   items.forEach((item) => {
  //     try {
  //       var newItem = {
  //         ...item
  //       };
  //       Clients.insert(newItem)
  //     }
  //     catch(err) {
  //       errorHandling(err, newItem);
  //     }
  //   })
  // }
  //
  // const updateUsers = () => {
  //   var items = Meteor.users.find().fetch();
  //   items.forEach((item) => {
  //     try {
  //       var newItem = {
  //         ...item,
  //         creationDate: item.createdAt,
  //         profile: {
  //           firstName: item.firstName,
  //           lastName: item.lastName,
  //           type: item.type
  //         }
  //       };
  //       Meteor.users.update({_id: item._id}, {$set: newItem});
  //       Meteor.users.update({_id: item._id},
  //         {
  //           $unset: {
  //             createdAt: "",
  //             firstName: "",
  //             lastName: "",
  //             type: "",
  //             pages: ""
  //           }
  //         }
  //       );
  //     }
  //     catch(err) {
  //       errorHandling(err, newItem);
  //     }
  //   })
  // }
  //
  // const manualFixDeletedContainers = () => {
  //   var deleted = [
  //     "d545e938fd2b648862efff18",
  //     "22129942ae191ec32b7f2680",
  //     "5ced80a43ec369f04b053875",
  //     "17f5496f71083cc8726f1c2b",
  //     "60c702e8591a69e433939fa2",
  //     "26a93d547fb4781fdb12db83"
  //   ]
  //   var container = Containers.find().fetch()[0];
  //   deleted.forEach((_id) => {
  //     container._id = _id;
  //     container.description = "CONTAINER DELETADO";
  //     Containers.insert(container, {bypassCollection2: true});
  //   })
  // }
  //
  // const updateProposals = (simulation) => {
  //   var items = Proposals.find().fetch();
  //   Proposals.remove({})
  //   items.forEach((item) => {
  //     try {
  //       var newItem = {
  //         ...item,
  //         type: "proposal",
  //         visible: true,
  //         snapshots: item.snapshots.map((snapshot, i) => {
  //           var active = false;
  //           if (typeof item.activeVersion === 'number') {
  //             active = item.activeVersion === i;
  //           }
  //           var user = Meteor.users.findOne({_id: snapshot.createdBy});
  //           var createdByName = user.profile.firstName + " " + user.profile.lastName;
  //           return {
  //             ...snapshot,
  //             active,
  //             createdById: snapshot.createdBy,
  //             createdByName,
  //             dates: {
  //               ...snapshot.dates,
  //               duration: Math.round(snapshot.dates.duration),
  //               startDate: snapshot.dates.startDate
  //                       || snapshot.dates.billingDate
  //             },
  //             containers: snapshot.containers.map((container) => {
  //               var fromDB = Containers.findOne({_id: container.productId});
  //               return {
  //                 ...fromDB,
  //                 price: container.price,
  //                 quantity: Math.round(container.renting)
  //               }
  //             }),
  //             accessories: snapshot.accessories.map((accessory) => {
  //               var fromDB = Accessories.findOne({_id: accessory.productId});
  //               return {
  //                 ...fromDB,
  //                 price: accessory.price,
  //                 quantity: Math.round(accessory.renting)
  //               }
  //             }),
  //             services: snapshot.services.map((service) => {
  //               var fromDB = Services.findOne({_id: service.productId});
  //               return {
  //                 ...fromDB,
  //                 price: service.price,
  //                 quantity: Math.round(service.renting)
  //               }
  //             })
  //           }
  //         })
  //       };
  //       if (simulation) {
  //         newItem = Proposals.simpleSchema().clean(newItem);
  //         Proposals.simpleSchema().validate(newItem);
  //       } else {
  //         Proposals.insert(newItem)
  //       }
  //     }
  //     catch(err) {
  //       Proposals.remove({})
  //       items.forEach((item) => {
  //         Proposals.insert(item, {bypassCollection2: true})
  //       })
  //
  //       errorHandling(err, newItem);
  //       throw err;
  //     }
  //   })
  // }
  //
  // const updateContracts = (simulation) => {
  //   var items = Contracts.find().fetch();
  //   Contracts.remove({})
  //   items.forEach((item) => {
  //     try {
  //       var newItem = {
  //         ...item,
  //         type: "contract",
  //         visible: true,
  //         proposalId: item.proposal,
  //         proposalIndex: item.proposalVersion,
  //         shipping: [],
  //         snapshots: item.snapshots.map((snapshot, i) => {
  //           var active = false;
  //           if (typeof item.activeVersion === 'number') {
  //             active = item.activeVersion === i;
  //           }
  //           var user = Meteor.users.findOne({_id: snapshot.createdBy});
  //           var createdByName = user.profile.firstName + " " + user.profile.lastName;
  //           var client = Clients.findOne({_id: snapshot.clientId}) || {}
  //           var observations;
  //           if (snapshot.observations) {
  //             observations = {
  //               internal: snapshot.observations.internal || '',
  //               external: snapshot.observations.external || ''
  //             }
  //           } else {
  //             observations = {
  //               internal: '',
  //               external: ''
  //             }
  //           }
  //           return {
  //             ...snapshot,
  //             active,
  //             client,
  //             createdById: snapshot.createdBy,
  //             createdByName,
  //             representativesId: [],
  //             billingProrogation: [],
  //             billingProducts: snapshot.billingProducts.map((billing) => {
  //               var account;
  //               if (billing.accountId) {
  //                 account = Accounts.findOne({_id: billing.accountId});
  //               } else {
  //                 account = Accounts.find().fetch()[0];
  //               }
  //               return {
  //                 ...billing,
  //                 account
  //               }
  //             }),
  //             billingServices: snapshot.billingServices.map((billing) => {
  //               var account;
  //               if (billing.accountId) {
  //                 account = Accounts.findOne({_id: billing.accountId});
  //               } else {
  //                 account = Accounts.find().fetch()[0];
  //               }
  //               var inss;
  //               if (billing.inss === 0) {
  //                 inss = 0;
  //               } else {
  //                 inss = billing.inss / 100;
  //               }
  //               var iss;
  //               if (billing.iss === 0) {
  //                 iss = 0;
  //               } else {
  //                 iss = billing.iss / 100;
  //               }
  //               return {
  //                 ...billing,
  //                 account,
  //                 inss,
  //                 iss
  //               }
  //             }),
  //             observations,
  //             dates: {
  //               ...snapshot.dates,
  //               duration: Math.round(snapshot.dates.duration),
  //               startDate: snapshot.dates.startDate
  //                       || snapshot.dates.billingDate
  //             },
  //             containers: snapshot.containers.map((container) => {
  //               var fromDB = Containers.findOne({_id: container.productId});
  //               return {
  //                 ...fromDB,
  //                 price: container.price,
  //                 quantity: Math.round(container.renting)
  //               }
  //             }),
  //             accessories: snapshot.accessories.map((accessory) => {
  //               var fromDB = Accessories.findOne({_id: accessory.productId});
  //               return {
  //                 ...fromDB,
  //                 price: accessory.price,
  //                 quantity: Math.round(accessory.renting)
  //               }
  //             }),
  //             services: snapshot.services.map((service) => {
  //               var fromDB = Services.findOne({_id: service.productId});
  //               return {
  //                 ...fromDB,
  //                 price: service.price,
  //                 quantity: Math.round(service.renting)
  //               }
  //             })
  //           }
  //         })
  //       };
  //       if (simulation) {
  //         newItem = Contracts.simpleSchema().clean(newItem);
  //         Contracts.simpleSchema().validate(newItem);
  //       } else {
  //         Contracts.insert(newItem)
  //       }
  //     }
  //     catch(err) {
  //       Contracts.remove({})
  //       items.forEach((item) => {
  //         Contracts.insert(item, {bypassCollection2: true})
  //       })
  //       errorHandling(err, newItem);
  //       throw err;
  //     }
  //   })
  // }
  //
  // try {
  //   // OK!
  //   console.log("Starting: createVariations")
  //   createVariations()
  //   console.log("Starting: updateContainers")
  //   manualFixDeletedContainers()
  //   updateContainers()
  //   console.log("Starting: updateSeries")
  //   updateSeries()
  //   console.log("Starting: updateAccessories")
  //   updateAccessories()
  //   console.log("Starting: updateModules")
  //   updateModules()
  //   console.log("Starting: updateServices")
  //   updateServices()
  //   console.log("Starting: updateClients")
  //   updateClients()
  //   console.log("Starting: updateUsers")
  //   updateUsers()
  //   History.remove({})
  //   Packs.remove({})
  //   updateProposals()
  //   updateContracts()
  //   console.dir(uniqueErrors, {depth: null});
  // }
  // catch(err) {
  //   throw err
  // }
  // console.log("DONE!")
  //
  // // END OF MIGRATION TO VERSION 3.0 -------------------


  // Proposals.simpleSchema().namedContext().validate()


  // var proposals = Proposals.find().fetch();
  //
  // proposals.forEach((pro) => {
  //   var _id = pro._id;
  //   var snapshots = pro.snapshots.map((snap) => {
  //     return {
  //       ...snap,
  //       dates: {
  //         ...snap.dates,
  //         startDate: snap.dates.deliveryDate,
  //         deliveryDate: undefined
  //       }
  //     }
  //   })
  //
  //   Proposals.update({ _id }, { $set: {
  //     ...pro,
  //     snapshots
  //   } } );
  //
  // })

//   Containers.update({}, {
//     $set: {
//       flyer: false
//     }
//   },
//   {multi: true}
// )

  // var collection = Containers.find().fetch();
  // //
  // // Containers.remove({});
  //
  // collection.forEach((item) => {
  //   var newItem = {
  //     ...item,
  //     flyer: false
  //   }
  //   Containers.insert(item);
  // })



  // var collection = Contracts.find().fetch();
  //
  // function convertToDate(value) {
  //   if (typeof value !== "object") {
  //     return new Date(value);
  //   } else return value;
  // }
  //
  // collection.forEach((contract) => {
  //   contract.snapshots.forEach((s) => {
  //     s.billingProducts.forEach((b) => {
  //       b.startDate = convertToDate(b.startDate);
  //       b.endDate = convertToDate(b.endDate);
  //       b.expiryDate = convertToDate(b.expiryDate);
  //     })
  //     s.billingServices.forEach((b) => {
  //       b.startDate = convertToDate(b.startDate);
  //       b.endDate = convertToDate(b.endDate);
  //       b.expiryDate = convertToDate(b.expiryDate);
  //     })
  //   })
  //   var _id = contract._id;
  //   delete contract._id;
  //   Contracts.update({ _id }, {
  //     ...contract,
  //   })
  // })
  //
  // // var collection = Series.find().fetch();
  //
  // // Series.remove({});
  //
  // var errors = [
  //   "257",
  //   "238",
  //   "198",
  //   "190",
  //   "191",
  //   "244",
  //   "165",
  //   "104",
  //   "208",
  //   "186",
  //   "192",
  //   "236"
  // ]
  //
  // errors.forEach((_id, n, arr) => {
  //   console.log(_id + ". STARTING: " + (n+1) + "/" + arr.length);
  //   var item = Series.findOne({_id});
  //
  //   var dateWithCode = "";
  //   var dateString = "";
  //   var code = "";
  //
  //   var images = item.snapshots[item.snapshots.length-1].images.map((image, i) => {
  //     var prefix = "https://locamex-app.s3-sa-east-1.amazonaws.com/";
  //
  //     if (!dateWithCode) {
  //       dateWithCode = image.match(/2019-\d\d-\d\d_\d*/g)[0];
  //       dateString = dateWithCode.split("_")[0];
  //       code = dateWithCode.split("_")[1];
  //     }
  //     var oldKey = `user-uploads/snapshots/series/${item._id}/${dateWithCode}/ss-series-${item._id}-${code}-${i}.jpg`;
  //     var newKey = image.replace(prefix, "");
  //     Meteor.call("aws.copy.object", oldKey, newKey);
  //     return prefix + newKey;
  //   })
  // })
  //
  // collection.forEach((item, n, arr) => {
  //   var newImageArray = [];
  //   var newSnapshots = [];
  //   console.log("STARTING ITEM: " + (n+1) + "/" + arr.length);
  //   if (item._id )
  //   if (Array.isArray(item.snapshots)) {
  //     if (item.snapshots.length) {
  //       var lastIndex = item.snapshots.length-1;
  //       var date = item.snapshots[lastIndex].date;
  //
  //       var dateWithCode = "";
  //       var dateString = "";
  //       var code = "";
  //
  //       newImageArray = item.snapshots[lastIndex].images.map((image, i) => {
  //         var prefix = "https://locamex-app.s3-sa-east-1.amazonaws.com/";
  //         var oldKey = image.replace(prefix, "");
  //         if (!dateWithCode) {
  //           dateWithCode = oldKey.match(/2019-\d\d-\d\d_\d*/g)[0];
  //           dateString = dateWithCode.split("_")[0];
  //           code = dateWithCode.split("_")[1];
  //         }
  //         var newKey = `user-uploads/images/series/${item._id}/${dateWithCode}/series-${item._id}-${code}-${i}.jpg`;
  //         Meteor.call("aws.copy.object", oldKey, newKey);
  //         return prefix + newKey;
  //       })
  //
  //       newSnapshots = [
  //         {
  //           date,
  //           images: newImageArray
  //         }
  //       ]
  //
  //     }
  //   }
  //
  //   var newItem = {
  //     ...item,
  //     snapshots: newSnapshots
  //   }
  //
  //   Series.insert(newItem);
  // })

  //// RENAMING ALL ACCESSORIES
  // collection.forEach((item, n, arr) => {
  //   var code = new Date().getTime();
  //   var newImageArray = [];
  //   console.log("STARTING ITEM: " + (n+1) + "/" + arr.length)
  //   if (Array.isArray(item.images)) {
  //     newImageArray = item.images.map((image, i) => {
  //       var prefix = "https://locamex-app.s3-sa-east-1.amazonaws.com/";
  //       var oldKey = image.replace(prefix, "");
  //       var newKey = `user-uploads/images/accessories/${item._id}/accessory-${item._id}-${code}-${i}.jpg`;
  //       Meteor.call("aws.rename.key", oldKey, newKey);
  //       return prefix + newKey;
  //     })
  //   }
  //
  //   Accessories.insert({
  //     ...item,
  //     images: newImageArray
  //   });
  // })

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
  //   return Meteor.call('aws.rename.key', data.oldKey, data.newKey);
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
  //   return Meteor.call('aws.rename.key', data.oldKey, data.newKey);
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
  // var backModules = [...modules];
  // var backContainers = [...containers];
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
  //     var modules = [...container.modules];
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