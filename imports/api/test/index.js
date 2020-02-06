import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';
//
// export const Test = new Mongo.Collection('test');
// export const Test2 = new Mongo.Collection('test2');
//


if (Meteor.isServer) {

  // Meteor.publish('testPub', () => {
  // if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
  //   return Test.rawCollection().aggregate(
  //     {$match: {productId: "123"}}
  //   )
  // })
}