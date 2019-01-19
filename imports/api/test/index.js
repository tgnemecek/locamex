import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

// export const Test = new Mongo.Collection('test');
// export const Test2 = new Mongo.Collection('test2');
//
// if (Meteor.isServer) {
//   Meteor.publish('testPub', () => {
//     return [
//       Test.find(),
//       Test2.find(),
//     ]
//   })
//
//   Test.remove({});
//   Test.insert({
//     name: "Thiago"
//   });
//   Test.insert({
//     name: "Mage"
//   });
//   Test2.remove({});
//   Test2.insert({
//     name: "NEW COLLECTION"
//   })
// }