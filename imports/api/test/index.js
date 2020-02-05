import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';

export const Test = new Mongo.Collection('test');
export const Test2 = new Mongo.Collection('test2');



if (Meteor.isServer) {
  // Test.insert({
  //   productId: "123"
  // })
  //
  // Test2.insert({
  //   id: "123",
  //   description: "Toldo"
  // })

  Meteor.publish('testPub', () => {
    return Test.rawCollection().aggregate(
      {$match: {productId: "123"}}
    )
  })
}