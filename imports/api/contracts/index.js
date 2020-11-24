import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import tools from "/imports/startup/tools/index";
import { Proposals } from "/imports/api/proposals/index";
import { Series } from "/imports/api/series/index";
import { Modules } from "/imports/api/modules/index";
import { Packs } from "/imports/api/packs/index";
import { Accessories } from "/imports/api/accessories/index";
import { Containers } from "/imports/api/containers/index";
import { Services } from "/imports/api/services/index";
import { Variations } from "/imports/api/variations/index";

export const Contracts = new Mongo.Collection("contracts");
Contracts.attachSchema(
  new SimpleSchema({
    _id: String,
    status: String,
    type: String,
    proposalId: String,
    proposalIndex: SimpleSchema.Integer,
    firstSnapshot: {
      type: Boolean,
      optional: true,
    },
    shipping: Array,
    "shipping.$": Object,
    "shipping.$._id": String,
    "shipping.$.date": Date,
    "shipping.$.type": {
      type: String,
      allowedValues: ["send", "receive"],
    },
    "shipping.$.series": Array,
    "shipping.$.series.$": Object,
    "shipping.$.series.$._id": String,
    "shipping.$.series.$.description": Number,
    "shipping.$.series.$.type": String,
    "shipping.$.series.$.container": Object,
    "shipping.$.series.$.container._id": String,
    "shipping.$.series.$.container.description": String,
    "shipping.$.series.$.place": Object,
    "shipping.$.series.$.place._id": String,
    "shipping.$.series.$.place.description": String,
    "shipping.$.series.$.snapshots": Array,
    "shipping.$.series.$.snapshots.$": {
      type: Object,
      blackbox: true,
    },

    "shipping.$.variations": Array,
    "shipping.$.variations.$": Object,
    "shipping.$.variations.$._id": String,
    "shipping.$.variations.$.type": String,
    "shipping.$.variations.$.description": String,
    "shipping.$.variations.$.observations": {
      type: String,
      optional: true,
    },
    "shipping.$.variations.$.accessory": Object,
    "shipping.$.variations.$.accessory._id": String,
    "shipping.$.variations.$.accessory.description": String,
    "shipping.$.variations.$.places": Array,
    "shipping.$.variations.$.places.$": Object,
    "shipping.$.variations.$.places.$._id": String,
    "shipping.$.variations.$.places.$.description": String,
    "shipping.$.variations.$.places.$.quantity": SimpleSchema.Integer,

    "shipping.$.packs": Array,
    "shipping.$.packs.$": Object,
    "shipping.$.packs.$._id": String,
    "shipping.$.packs.$.description": String,
    "shipping.$.packs.$.type": String,
    "shipping.$.packs.$.unmount": {
      type: Boolean,
      optional: true,
    },
    "shipping.$.packs.$.place": {
      type: Object,
      optional: true,
    },
    "shipping.$.packs.$.place._id": String,
    "shipping.$.packs.$.place.description": String,
    "shipping.$.packs.$.container": Object,
    "shipping.$.packs.$.container._id": String,
    "shipping.$.packs.$.container.description": String,
    "shipping.$.packs.$.modules": Array,
    "shipping.$.packs.$.modules.$": Object,
    "shipping.$.packs.$.modules.$._id": String,
    "shipping.$.packs.$.modules.$.description": String,
    "shipping.$.packs.$.modules.$.type": String,
    "shipping.$.packs.$.modules.$.quantity": {
      type: SimpleSchema.Integer,
      optional: true,
    },
    "shipping.$.packs.$.modules.$.places": {
      type: Array,
      optional: true,
    },
    "shipping.$.packs.$.modules.$.places.$": Object,
    "shipping.$.packs.$.modules.$.places.$._id": String,
    "shipping.$.packs.$.modules.$.places.$.description": String,
    "shipping.$.packs.$.modules.$.places.$.quantity": SimpleSchema.Integer,

    visible: Boolean,
    snapshots: Array,
    "snapshots.$": new SimpleSchema({
      active: Boolean,
      createdById: String,
      createdByName: String,
      client: {
        type: Object,
        blackbox: true,
      },
      negociatorId: {
        type: String,
        optional: true,
      },
      representativesId: Array,
      "representativesId.$": {
        type: String,
        optional: true,
      },
      discount: Number,
      observations: Object,
      "observations.internal": {
        type: String,
        optional: true,
      },
      "observations.external": {
        type: String,
        optional: true,
      },
      deliveryAddress: {
        type: Object,
        blackbox: true,
      },
      dates: Object,
      "dates.creationDate": Date,
      "dates.startDate": Date,
      "dates.duration": SimpleSchema.Integer,
      "dates.creationDate": Date,
      "dates.timeUnit": {
        type: String,
        allowedValues: ["months", "days"],
      },
      billingProducts: Array,
      "billingProducts.$": Object,
      "billingProducts.$.description": String,
      "billingProducts.$.value": Number,
      "billingProducts.$.startDate": Date,
      "billingProducts.$.endDate": Date,
      "billingProducts.$.expiryDate": Date,
      "billingProducts.$.account": Object,
      "billingProducts.$.account._id": String,
      "billingProducts.$.account.description": String,
      "billingProducts.$.account.bank": String,
      "billingProducts.$.account.bankNumber": String,
      "billingProducts.$.account.number": String,
      "billingProducts.$.account.branch": String,
      "billingProducts.$.status": {
        type: String,
        optional: true,
      },
      "billingProducts.$._id": {
        type: String,
        optional: true,
      },
      "billingProducts.$.valuePayed": {
        type: Number,
        optional: true,
      },
      "billingProducts.$.observations": {
        type: String,
        optional: true,
      },
      "billingProducts.$.annotations": {
        type: String,
        optional: true,
      },

      billingProrogation: Array,
      "billingProrogation.$": Object,
      "billingProrogation.$.description": String,
      "billingProrogation.$.value": Number,
      "billingProrogation.$.startDate": Date,
      "billingProrogation.$.endDate": Date,
      "billingProrogation.$.expiryDate": Date,
      "billingProrogation.$.account": Object,
      "billingProrogation.$.account._id": String,
      "billingProrogation.$.account.description": String,
      "billingProrogation.$.account.bank": String,
      "billingProrogation.$.account.bankNumber": String,
      "billingProrogation.$.account.number": String,
      "billingProrogation.$.account.branch": String,
      "billingProrogation.$.status": {
        type: String,
        optional: true,
      },
      "billingProrogation.$._id": {
        type: String,
        optional: true,
      },
      "billingProrogation.$.valuePayed": {
        type: Number,
        optional: true,
      },
      "billingProrogation.$.observations": {
        type: String,
        optional: true,
      },
      "billingProrogation.$.annotations": {
        type: String,
        optional: true,
      },

      billingServices: Array,
      "billingServices.$": Object,
      "billingServices.$.description": String,
      "billingServices.$.inss": {
        type: Number,
        min: 0,
        max: 1,
      },
      "billingServices.$.iss": {
        type: Number,
        min: 0,
        max: 1,
      },
      "billingServices.$.value": Number,
      "billingServices.$.expiryDate": Date,
      "billingServices.$.account": Object,
      "billingServices.$.account._id": String,
      "billingServices.$.account.description": String,
      "billingServices.$.account.bank": String,
      "billingServices.$.account.bankNumber": String,
      "billingServices.$.account.number": String,
      "billingServices.$.account.branch": String,
      "billingServices.$.status": {
        type: String,
        optional: true,
      },
      "billingServices.$.valuePayed": {
        type: Number,
        optional: true,
      },
      "billingServices.$.observations": {
        type: String,
        optional: true,
      },
      "billingServices.$.annotations": {
        type: String,
        optional: true,
      },

      containers: Array,
      "containers.$": Object,
      "containers.$._id": String,
      "containers.$.type": String,
      "containers.$.description": String,
      "containers.$.restitution": Number,
      "containers.$.price": Number,
      "containers.$.quantity": SimpleSchema.Integer,

      accessories: Array,
      "accessories.$": Object,
      "accessories.$._id": String,
      "accessories.$.type": String,
      "accessories.$.description": String,
      "accessories.$.restitution": Number,
      "accessories.$.price": Number,
      "accessories.$.quantity": SimpleSchema.Integer,

      services: Array,
      "services.$": Object,
      "services.$._id": String,
      "services.$.type": String,
      "services.$.description": String,
      "services.$.price": Number,
      "services.$.quantity": SimpleSchema.Integer,
    }),
  })
);

Contracts.deny({
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
  Meteor.publish("contractsPub", () => {
    if (!Meteor.userId()) throw new Meteor.Error("unauthorized");
    if (!tools.isReadAllowed("contracts")) return [];
    return Contracts.find({}, { sort: { _id: -1 } });
  });

  Meteor.methods({
    "contracts.insert"(proposalId) {
      if (!Meteor.userId() || !tools.isWriteAllowed("proposals")) {
        throw new Meteor.Error("unauthorized");
      }
      var proposal = Proposals.findOne({ _id: proposalId });
      var proposalIndex;
      var snapshot = proposal.snapshots.find((snapshot, i) => {
        if (snapshot.active === true) {
          proposalIndex = i;
          return true;
        }
      });

      var prefix = new Date().getFullYear();
      var offset = 179;
      var suffix =
        Contracts.find({
          _id: {
            $regex: new RegExp(prefix),
          },
        }).count() + offset;

      var _id = prefix + "-" + suffix.toString().padStart(3, "0");
      var user = Meteor.user();

      var contract = {
        _id,
        status: "inactive",
        type: "contract",
        proposalId: proposalId,
        proposalIndex,
        shipping: [],
        firstSnapshot: true,
        visible: true,
        snapshots: [
          {
            active: false,
            createdById: snapshot.createdById,
            createdByName: snapshot.createdByName,
            client: {
              _id: "",
              description: "",
              type: "",
              registry: "",
              officialName: "",
              registryES: "",
              registryMU: "",
              observations: "",
              contacts: [],
              address: {
                street: "",
                cep: "",
                city: "",
                state: "",
                number: "",
                additional: "",
              },
            },
            negociatorId: "",
            representativesId: [],
            discount: snapshot.discount,
            observations: {
              internal: "",
              external: "",
            },
            deliveryAddress: {
              street: "",
              cep: "",
              city: "",
              state: "SP",
              number: "",
              additional: "",
            },
            dates: {
              creationDate: new Date(),
              startDate: snapshot.dates.startDate,
              duration: snapshot.dates.duration,
              timeUnit: snapshot.dates.timeUnit,
            },

            billingProducts: [],
            billingServices: [],
            billingProrogation: [],

            containers: snapshot.containers,
            accessories: snapshot.accessories,
            services: snapshot.services,
          },
        ],
      };
      Contracts.insert(contract);

      return _id;
    },
    "contracts.update"(snapshot, _id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed("contracts")) {
        throw new Meteor.Error("unauthorized");
      }

      var oldContract = Contracts.findOne({ _id });
      var hasChanged = !tools.compare(
        oldContract.snapshots[index],
        snapshot,
        "internal"
      );

      if (!hasChanged) {
        return {
          hasChanged: false,
          snapshot,
          contract: oldContract,
          index,
        };
      }

      var data;
      var newIndex;

      if (oldContract.firstSnapshot) {
        newIndex = 0;
        data = {
          ...oldContract,
          firstSnapshot: false,
          snapshots: [snapshot],
        };
      } else {
        newIndex = oldContract.snapshots.length;
        data = tools.deepCopy(oldContract);
        data.snapshots.push(snapshot);
      }

      Contracts.update({ _id }, { $set: data });

      return {
        hasChanged: true,
        snapshot,
        contract: data,
        index: newIndex,
      };
    },
    "contracts.activate"(_id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed("contracts")) {
        throw new Meteor.Error("unauthorized");
      }
      var contract = Contracts.findOne({ _id });
      var backupContract = tools.deepCopy(contract);
      var snapshot = contract.snapshots[index];

      function findDeletedItems(array, Database) {
        var itemDescription = "";
        var verification = array.every((item) => {
          itemDescription = item.description;
          var itemFromDB = Database.findOne({ _id: item._id });
          return itemFromDB.visible;
        });
        if (!verification) {
          throw new Meteor.Error(
            "document-contains-deleted-items",
            itemDescription
          );
        }
      }

      findDeletedItems(snapshot.containers, Containers);
      findDeletedItems(snapshot.accessories, Accessories);
      findDeletedItems(snapshot.services, Services);

      contract.status = "active";
      contract.snapshots[index].active = true;
      Contracts.update({ _id }, { $set: contract });
      return _id;
    },
    "contracts.finalize"(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed("contracts")) {
        throw new Meteor.Error("unauthorized");
      }
      var contract = Contracts.findOne({ _id });
      var snapshot = contract.snapshots.find((snapshot) => {
        return snapshot.active;
      });

      function isUserAllowedToFinalize() {
        if (contract.status !== "active") return false;
        if (Meteor.user().profile.type === "administrator") return true;

        let billingProductsDone = snapshot.billingProducts.every(
          (bill) => bill.status === "finished"
        );

        if (!billingProductsDone) return false;

        let billingServicesDone = snapshot.billingServices.every(
          (bill) => bill.status === "finished"
        );

        if (!billingServicesDone) return false;
      }

      if (!isUserAllowedToFinalize()) {
        throw new Meteor.Error("unauthorized");
      }

      function finalizeBills(billing) {
        return billing.map((bill) => {
          return { ...bill, status: "finished" };
        });
      }

      snapshot.billingProducts = finalizeBills(snapshot.billingProducts);
      snapshot.billingServices = finalizeBills(snapshot.billingServices);
      snapshot.billingProrogation = finalizeBills(snapshot.billingProrogation);
      contract.status = "finalized";
      Contracts.update({ _id }, { $set: contract });
      return _id;
    },
    "contracts.cancel"(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed("contracts")) {
        throw new Meteor.Error("unauthorized");
      }
      var contract = Contracts.findOne({ _id });
      var proposal = Proposals.findOne({ _id: contract.proposalId });

      proposal.status = "inactive";
      proposal.snapshots[contract.proposalIndex].active = false;
      delete proposal._id;

      Proposals.update({ _id: contract.proposalId }, { $set: { ...proposal } });
      Contracts.update({ _id }, { $set: { status: "cancelled" } });

      return _id;
    },
    "contracts.shipping.send"(data) {
      if (!Meteor.userId() || !tools.isWriteAllowed("shipping")) {
        throw new Meteor.Error("unauthorized");
      }
      var _id = data.contractId;
      var contract = Contracts.findOne({ _id });

      var shipping = [...contract.shipping];

      var packCount = Packs.find({}).count();

      data = {
        series: data.series.filter((item) => {
          return item._id;
        }),
        variations: data.variations.filter((item) => {
          return item.places.length;
        }),
        packs: data.packs
          .filter((item) => {
            return item.modules.length;
          })
          .map((item, i) => {
            if (item.locked) return item;
            var description = (packCount + i).toString();
            description = "M" + description.padStart(4, "0");
            var _id = tools.generateId();
            return {
              ...item,
              _id,
              description,
            };
          }),
        _id: tools.generateId(),
        date: new Date(),
        type: "send",
      };
      shipping.push(tools.deepCopy(data));

      const executeTransactions = (isSimulation) => {
        data.series.forEach((series) => {
          if (isSimulation) {
            var currentSeries = Series.findOne({ _id: series._id });
            if (currentSeries.rented) {
              throw new Meteor.Error("stock-unavailable", "", {
                _id: currentSeries._id,
                type: currentSeries.type,
                item: currentSeries.description,
                place: currentSeries.place.description,
              });
            }
          } else {
            Series.update(
              { _id: series._id },
              {
                $set: {
                  place: {},
                  rented: true,
                },
              }
            );
          }
        });
        data.variations.forEach((variation) => {
          const { places } = Variations.findOne({ _id: variation._id });

          if (isSimulation) {
            variation.places.forEach((place) => {
              const { available } = places.find(({ _id }) => _id === place._id);
              if (place.quantity > available) {
                throw new Meteor.Error("stock-unavailable", "", variation);
              }
            });
          } else {
            const rentedTotal = variation.places.reduce((acc, cur) => {
              return acc + cur.quantity;
            }, 0);

            const newPlaces = places
              .map((place) => {
                const { quantity } =
                  variation.places.find(({ _id }) => _id === place._id) || {};
                if (typeof quantity === "number") {
                  return {
                    ...place,
                    available: place.available - quantity,
                  };
                }
                return place;
              })
              .filter((place) => place.available || place.inactive);

            Variations.update(
              { _id: variation._id },
              {
                $set: {
                  places: newPlaces,
                  rented: rentedTotal,
                },
              }
            );
            Accessories.update(
              { _id: variation.accessory._id },
              {
                $inc: {
                  rented: rentedTotal,
                  available: -rentedTotal,
                },
              }
            );
          }
        });
        var altDataPacks = tools.deepCopy(data.packs);
        data.packs.forEach((pack, p) => {
          if (pack.locked) {
            if (!isSimulation) {
              Packs.update(
                { _id: pack._id },
                {
                  $set: {
                    rented: true,
                    place: {
                      _id: "",
                      description: "",
                    },
                  },
                }
              );
            }
          } else {
            pack.modules.forEach((module, m) => {
              var newModule = Modules.findOne({ _id: module._id });
              var modRented = 0;
              module.places.forEach((fromPlace) => {
                var oldPlace = newModule.places.find((oldPl) => {
                  return oldPl._id === fromPlace._id;
                });
                modRented += fromPlace.quantity;
                oldPlace.available -= fromPlace.quantity;
                if (oldPlace.available < 0) {
                  throw new Meteor.Error("stock-unavailable", "", newModule);
                }
              });
              newModule.rented += modRented;
              altDataPacks[p].modules[m].quantity = modRented;
              delete altDataPacks[p].modules[m].places;
              if (!isSimulation) {
                Modules.update({ _id: newModule._id }, { $set: newModule });
              }
            });
            if (!isSimulation) {
              Packs.insert({
                ...altDataPacks[p],
                visible: true,
                rented: true,
                place: {
                  _id: "",
                  description: "",
                },
              });
            }
          }
        });
      };

      executeTransactions(true);
      executeTransactions(false);
      Contracts.update({ _id }, { $set: { shipping } });
      return _id;
    },
    "contracts.shipping.receive"(data) {
      if (!Meteor.userId() || !tools.isWriteAllowed("shipping")) {
        throw new Meteor.Error("unauthorized");
      }
      var _id = data.contractId;
      var contract = Contracts.findOne({ _id });

      var shipping = [...contract.shipping];

      data = {
        series: data.series.filter((item) => {
          return item.place._id;
        }),
        variations: data.variations.filter((item) => {
          return item.place._id && item.quantity;
        }),
        packs: data.packs.filter((item) => {
          return item.place._id;
        }),
        _id: tools.generateId(),
        date: new Date(),
        type: "receive",
      };

      const executeTransactions = (isSimulation) => {
        data.series.forEach((series) => {
          if (isSimulation) {
            var isRented = false;
            for (var i = shipping.length - 1; i >= 0; i--) {
              var found = shipping[i].series.find((item) => {
                return item._id === series._id;
              });
              if (found) {
                isRented = !!shipping.type === "send";
                break;
              }
            }
            if (isRented)
              throw new Meteor.Error("stock-unavailable", "", {
                _id: series._id,
                item: series,
              });
          } else {
            Series.update(
              { _id: series._id },
              {
                $set: {
                  place: {
                    _id: series.place._id,
                    description: series.place.description,
                  },
                  rented: false,
                },
              }
            );
          }
        });
        data.variations.forEach((variation) => {
          var varFromDb = Variations.findOne({ _id: variation._id });
          var found = varFromDb.places.find((place) => {
            return place._id === variation.place._id;
          });
          if (found) {
            found.available += variation.quantity;
          } else {
            varFromDb.places.push({
              _id: variation.place._id,
              description: variation.place.description,
              available: variation.quantity,
              inactive: 0,
            });
          }
          variation.places = [
            {
              ...variation.place,
              quantity: variation.quantity,
            },
          ];

          if (!isSimulation) {
            Variations.update({ _id: variation._id }, { $set: varFromDb });
            Accessories.update(
              { _id: variation.accessory._id },
              {
                $inc: {
                  available: variation.quantity,
                  rented: -variation.quantity,
                },
              }
            );
          }
        });
        data.packs.forEach((pack) => {
          if (isSimulation) {
            var isRented = false;
            for (var i = shipping.length - 1; i >= 0; i--) {
              var found = shipping[i].packs.find((item) => {
                return item._id === pack._id;
              });
              if (found) {
                isRented = !!shipping.type === "send";
                break;
              }
            }
            if (isRented)
              throw new Meteor.Error("stock-unavailable", "", {
                _id: pack._id,
                item: pack,
              });
          } else {
            if (pack.unmount) {
              Meteor.call("packs.unmount", pack._id, pack.place);
            } else {
              Meteor.call("packs.update", pack._id, {
                place: {
                  _id: pack.place._id,
                  description: pack.place.description,
                },
                rented: false,
              });
            }
          }
        });
      };

      executeTransactions(true);
      executeTransactions(false);

      shipping.push(data);

      Contracts.update({ _id }, { $set: { shipping } });
      return _id;
    },
    "contracts.billing.update"(_id, bill) {
      if (!Meteor.userId() || !tools.isWriteAllowed("contracts")) {
        throw new Meteor.Error("unauthorized");
      }

      var contract = Contracts.findOne({ _id });
      var snapshot = contract.snapshots.find((snapshot) => {
        return snapshot.active;
      });
      var billing = snapshot[bill.type];
      var oldBill = billing[bill.index];
      var newStatus;

      switch (bill.status) {
        case "ready":
          newStatus = "billed";
          break;
        case "billed":
        case "late":
          newStatus = bill.payedInFull ? "finished" : "billed";
          break;
        case "finished":
          oldBill.annotations = bill.annotations;
          Contracts.update({ _id }, { $set: contract });
          return bill;
        default:
          throw new Meteor.Error("status-unknown", "", bill);
      }
      var billId;
      if (bill.type !== "billingServices") {
        var count = 1;
        Contracts.find({ status: { $ne: "inactive" } }).forEach((contract) => {
          var snapshot = contract.snapshots.find((snapshot) => {
            return snapshot.active;
          });
          if (snapshot) {
            const countBills = (arr) => {
              arr.forEach((bill) => {
                if (bill._id) count++;
              });
            };
            countBills(snapshot.billingProducts);
            countBills(snapshot.billingProrogation);
          }
        });
        billId = count.toString().padStart(4, "0");
      }

      var newBill = {
        _id: billId,
        ...bill,
        status: newStatus,
      };

      if (!oldBill) {
        billing.push(newBill);
      } else {
        billing[bill.index] = newBill;
      }

      Contracts.update({ _id }, { $set: contract });
      return newBill;
    },
  });
}
