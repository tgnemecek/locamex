import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { Places } from "/imports/api/places/index";
import { Proposals } from "/imports/api/proposals/index";
import { Contracts } from "/imports/api/contracts/index";
import tools from "/imports/startup/tools/index";

export const Accessories = new Mongo.Collection("accessories");
Accessories.attachSchema(
  new SimpleSchema({
    _id: String,
    type: String,
    description: String,
    price: Number,
    restitution: Number,
    available: SimpleSchema.Integer,
    inactive: SimpleSchema.Integer,
    rented: SimpleSchema.Integer,
    visible: Boolean,
  })
);

Accessories.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

if (Meteor.isServer) {
  Meteor.publish("accessoriesPub", () => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("accessories")) return [];
    return Accessories.find({ visible: true }, { sort: { description: 1 } });
  });

  Meteor.methods({
    "accessories.insert"(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed("accessories")) {
        throw new Meteor.Error("unauthorized");
      }
      const _id = tools.generateId();
      var data = {
        _id,
        type: "accessory",
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        available: 0,
        inactive: 0,
        rented: 0,
        visible: true,
      };
      Meteor.call("variations.update", { ...state, _id });
      Accessories.insert(data);

      return true;
    },
    "accessories.update"(state) {
      if (!Meteor.userId() || !tools.isWriteAllowed("accessories")) {
        throw new Meteor.Error("unauthorized");
      }
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution,
      };
      Meteor.call("variations.update", state);

      // Updating References:
      var changes = {
        description: data.description,
        restitution: data.restitution,
      };

      const updateDocuments = (Collection) => {
        Collection.find({ status: "inactive" }).forEach((doc) => {
          const snapshots = doc.snapshots.map((snapshot) => {
            const accessories = snapshot.accessories.map((accessory) => {
              if (accessory._id === state._id) {
                return {
                  ...accessory,
                  ...changes,
                };
              } else return accessory;
            });
            return { ...snapshot, accessories };
          });
          Collection.update({ _id: doc._id }, { $set: { snapshots } });
        });
      };

      updateDocuments(Proposals);
      updateDocuments(Contracts);

      Accessories.update({ _id: state._id }, { $set: data });
      return true;
    },
    "accessories.hide"(_id) {
      var accessory = Accessories.findOne({ _id });
      if (accessory.rented || accessory.inactive || accessory.available) {
        throw new Meteor.Error("stock-must-be-zero");
      }
      Meteor.call("variations.hide.all", _id);
      Accessories.update({ _id }, { $set: { visible: false } });
      return true;
    },
    // 'accessories.update.stock'(variations) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   var available = 0;
    //   var inactive = 0;
    //
    //   variations.forEach((variation) => {
    //     variation.places.forEach((place) => {
    //       available += place.available;
    //       inactive += place.inactive;
    //     })
    //   })
    //   var accessoryId = variations[0].accessory._id;
    //   Accessories.update({_id: accessoryId}, {$set: {
    //     available,
    //     inactive
    //   }});
    //   //
    //   return true;
    // },
    // 'accessories.update.images'(_id, images) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   Accessories.update({ _id }, { $set: {images} });
    //   updateReferences(_id, {images});
    //
    //   return _id;
    // },
    // 'accessories.shipping.send'(product) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   var _id = product._id;
    //   delete product._id;
    //   Accessories.update({ _id }, product);
    //
    // },
    // 'accessories.shipping.receive'(product) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   var _id = product._id;
    //   delete product._id;
    //   Accessories.update({ _id }, product);
    //
    // },
    // 'accessories.hide'(_id) {
    //   if (!Meteor.userId() || !tools.isWriteAllowed('accessories')) {
    //     throw new Meteor.Error('unauthorized');
    //   }
    //   var visible = false;
    //   Accessories.update({ _id }, { $set: {visible} });
    //
    //   return true;
    // }
  });
}
