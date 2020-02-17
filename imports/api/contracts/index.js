import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';
import { accountsSchema } from '/imports/api/accounts/index';
import { Proposals } from '/imports/api/proposals/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Accessories } from '/imports/api/accessories/index';
import { Variations } from '/imports/api/variations/index';

export const Contracts = new Mongo.Collection('contracts');
Contracts.attachSchema(new SimpleSchema({
  _id: String,
  status: String,
  proposalId: String,
  proposalIndex: SimpleSchema.Integer,
  firstSnapshot: {
    type: Boolean,
    optional: true
  },
  shipping: Array,
  'shipping.$': Object,
  'shipping.$._id': String,
  'shipping.$.date': Date,
  'shipping.$.type': {
    type: String,
    allowedValues: ["send", "receive"]
  },
  'shipping.$.series': Array,
  'shipping.$.series.$': Object,
  'shipping.$.series.$._id': String,
  'shipping.$.series.$.description': Number,
  'shipping.$.series.$.type': String,
  'shipping.$.series.$.container': Object,
  'shipping.$.series.$.container._id': String,
  'shipping.$.series.$.container.description': String,
  'shipping.$.series.$.place': Object,
  'shipping.$.series.$.place._id': String,
  'shipping.$.series.$.place.description': String,
  'shipping.$.series.$.snapshots': Array,
  'shipping.$.series.$.snapshots.$': {
    type: Object,
    blackbox: true
  },

  'shipping.$.variations': Array,
  'shipping.$.variations.$': Object,
  'shipping.$.variations.$._id': String,
  'shipping.$.variations.$.type': String,
  'shipping.$.variations.$.description': String,
  'shipping.$.variations.$.observations': {
    type: String,
    optional: true
  },
  'shipping.$.variations.$.accessory': Object,
  'shipping.$.variations.$.accessory._id': String,
  'shipping.$.variations.$.accessory.description': String,
  'shipping.$.variations.$.places': Array,
  'shipping.$.variations.$.places.$': Object,
  'shipping.$.variations.$.places.$._id': String,
  'shipping.$.variations.$.places.$.description': String,
  'shipping.$.variations.$.places.$.quantity': SimpleSchema.Integer,

  'shipping.$.packs': Array,
  'shipping.$.packs.$': Object,
  'shipping.$.packs.$._id': String,
  'shipping.$.packs.$.description': String,
  'shipping.$.packs.$.type': String,
  'shipping.$.packs.$.container': Object,
  'shipping.$.packs.$.container._id': String,
  'shipping.$.packs.$.container.description': String,
  'shipping.$.packs.$.modules': Array,
  'shipping.$.packs.$.modules.$': Object,
  'shipping.$.packs.$.modules.$._id': String,
  'shipping.$.packs.$.modules.$.description': String,
  'shipping.$.packs.$.modules.$.type': String,
  'shipping.$.packs.$.modules.$.places': {
    type: Array,
    optional: true
  },
  'shipping.$.packs.$.modules.$.places.$': Object,
  'shipping.$.packs.$.modules.$.places.$._id': String,
  'shipping.$.packs.$.modules.$.places.$.description': String,
  'shipping.$.packs.$.modules.$.places.$.quantity': SimpleSchema.Integer,

  visible: Boolean,
  snapshots: Array,
  'snapshots.$': new SimpleSchema({
    active: Boolean,
    createdById: String,
    createdByName: String,
    client: {
      type: Object,
      blackbox: true
    },
    negociatorId: {
      type: String,
      optional: true
    },
    representativesId: Array,
    'representativesId.$': String,
    discount: Number,
    observations: Object,
    'observations.internal': {
      type: String,
      optional: true
    },
    'observations.external': {
      type: String,
      optional: true
    },
    deliveryAddress: {
      type: Object,
      blackbox: true
    },
    dates: Object,
    'dates.creationDate': Date,
    'dates.startDate': Date,
    'dates.duration': SimpleSchema.Integer,
    'dates.creationDate': Date,
    'dates.timeUnit': {
      type: String,
      allowedValues: ['months', 'days']
    },
    billingProducts: Array,
    'billingProducts.$': Object,
    'billingProducts.$.description': String,
    'billingProducts.$.value': Number,
    'billingProducts.$.startDate': Date,
    'billingProducts.$.endDate': Date,
    'billingProducts.$.expiryDate': Date,
    'billingProducts.$.account': accountsSchema,
    billingServices: Array,
    'billingServices.$': Object,
    'billingServices.$.description': String,
    'billingServices.$.inss': {
      type: Number,
      min: 0,
      max: 1
    },
    'billingServices.$.iss': {
      type: Number,
      min: 0,
      max: 1
    },
    'billingServices.$.value': Number,
    'billingServices.$.expiryDate': Date,
    'billingServices.$.account': accountsSchema,

    containers: Array,
    'containers.$': Object,
    'containers.$._id': String,
    'containers.$.type': String,
    'containers.$.description': String,
    'containers.$.restitution': Number,
    'containers.$.price': Number,
    'containers.$.quantity': SimpleSchema.Integer,

    accessories: Array,
    'accessories.$': Object,
    'accessories.$._id': String,
    'accessories.$.type': String,
    'accessories.$.description': String,
    'accessories.$.restitution': Number,
    'accessories.$.price': Number,
    'accessories.$.quantity': SimpleSchema.Integer,

    services: Array,
    'services.$': Object,
    'services.$._id': String,
    'services.$.type': String,
    'services.$.description': String,
    'services.$.price': Number,
    'services.$.quantity': SimpleSchema.Integer
  })
}))

Contracts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('contractsPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('contracts')) return [];
    return Contracts.find({}, {sort: { _id: -1 }});
  })

  Meteor.methods({
    'contracts.insert'(proposalId) {
      if (!Meteor.userId() || !tools.isWriteAllowed('proposals')) {
        throw new Meteor.Error('unauthorized');
      }
      var proposal = Proposals.findOne({ _id: proposalId });
      var proposalIndex;
      var snapshot = proposal.snapshots.find((snapshot, i) => {
        if (snapshot.active === true) {
          proposalIndex = i;
          return true
        }
      });

      var prefix = new Date().getFullYear();
      var offset = 32;
      var suffix = Contracts.find(
        { _id: {
          $regex: new RegExp(prefix)}
        }).count() + offset;

      var _id = prefix + '-' + suffix.toString().padStart(3, '0');
      var user = Meteor.user();

      var contract = {
        _id,
        status: 'inactive',
        proposalId: proposalId,
        proposalIndex,
        shipping: [],
        firstSnapshot: true,
        visible: true,
        snapshots: [{
          active: false,
          createdById: snapshot.createdById,
          createdByName: snapshot.createdByName,
          client: {
            _id: '',
            description: '',
            type: '',
            registry: '',
            officialName: '',
            registryES: '',
            registryMU: '',
            observations: '',
            contacts: [],
            address: {
              street: '',
              cep: '',
              city: '',
              state: '',
              number: '',
              additional: '',
            }
          },
          negociatorId: '',
          representativesId: [],
          discount: snapshot.discount,
          observations: {
            internal: '',
            external: ''
          },
          deliveryAddress: {
            street: '',
            cep: '',
            city: '',
            state: 'SP',
            number: '',
            additional: '',
          },
          dates: {
            creationDate: new Date(),
            startDate: snapshot.dates.startDate,
            duration: snapshot.dates.duration,
            timeUnit: snapshot.dates.timeUnit
          },

          billingProducts: [],
          billingServices: [],

          containers: snapshot.containers,
          accessories: snapshot.accessories,
          services: snapshot.services
        }]
      }
      Contracts.insert(contract);
      Meteor.call('history.insert', contract, 'contracts.insert');
      return _id;
    },
    'contracts.update'(snapshot, _id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
      }

      var oldContract = Contracts.findOne({ _id });
      var hasChanged = !tools.compare(
        oldContract.snapshots[index], snapshot
      );

      if (!hasChanged) {
        return {hasChanged: false};
      }

      var data;
      var newIndex;

      if (oldContract.firstSnapshot) {
        newIndex = 0;
        data = {
          ...oldContract,
          firstSnapshot: false,
          snapshots: [snapshot]
        }
      } else {
        newIndex = oldContract.snapshots.length;
        data = oldContract;
        data.snapshots.push(snapshot);
      }

      Contracts.update({ _id }, {$set: data})
      Meteor.call('history.insert', {_id, ...snapshot}, 'contracts.update');
      return {
        hasChanged: true,
        snapshot,
        index: newIndex
      };
    },
    'contracts.activate'(_id, index) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
      }
      var contract = Contracts.findOne({ _id });

      contract.status = 'active';
      contract.snapshots[index].active = true;

      Contracts.update({ _id }, {$set: contract});
      Meteor.call('history.insert', _id, 'contracts.activate');
      return true;
    },
    'contracts.finalize'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
      }
      Contracts.update({ _id }, { $set: { status: "finalized" } } );
      Meteor.call('history.insert', { _id }, 'contracts.finalize');
      return _id;
    },
    'contracts.cancel'(_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
      }
      var contract = Contracts.findOne({_id});
      var proposal = Proposals.findOne({_id: contract.proposalId});

      proposal.status = 'inactive';
      proposal.snapshots[contract.proposalIndex].active = false;

      Proposals.update({ _id: contract.proposalId }, proposal);
      Contracts.update({ _id }, { $set: { status: "cancelled" } } );
      Meteor.call('history.insert', { _id }, 'contracts.cancel');
      return _id;
    },
    'contracts.shipping.send'(data) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
      }
      var _id = data.contractId;
      var contract = Contracts.findOne({ _id });

      var shipping = [...contract.shipping];

      var packCount = Packs.find({}).count();

      data = {
        series: data.series.filter((item) => {
          return item._id
        }),
        variations: data.variations.filter((item) => {
          return item.places.length;
        }),
        packs: data.packs.filter((item) => {
          return item.modules.length;
        }).map((item, i) => {
          if (item.locked) return item;
          var description = (packCount+i).toString();
          description = "M" + description.padStart(4, '0');
          var _id = tools.generateId();
          return {
            ...item,
            _id,
            description
          }
        }),
        _id: tools.generateId(),
        date: new Date(),
        type: 'send'
      }
      shipping.push(tools.deepCopy(data));

      const executeTransactions = (isSimulation) => {
        data.series.forEach((series) => {
          if (isSimulation) {
            var currentSeries = Series.findOne({_id: series._id});
            if (currentSeries.rented) {
              throw new Meteor.Error('stock-unavailable', '', {
                _id: currentSeries._id,
                type: currentSeries.type,
                item: currentSeries.description,
                place: currentSeries.place.description
              })
            }
          } else {
            Series.update({_id: series._id}, {$set: {
              place: {},
              rented: true
            }})
          }
        })
        data.variations.forEach((variation) => {
          var varFromDb = Variations.findOne({_id: variation._id})
          var rentedTotal = 0;
          variation.places.forEach((place) => {
            var found = varFromDb.places.find((placeFromDb) => {
              return placeFromDb._id === place._id
            })
            if (found) {
              found.available -= place.quantity;
              rentedTotal += place.quantity;
              if (found.available < 0) {
                throw new Meteor.Error('stock-unavailable', '', variation)
              }
            } else throw new Meteor.Error('stock-unavailable', '', variation)
          })
          if (!isSimulation) {
            Variations.update({_id: variation._id}, {$set: varFromDb})
            Accessories.update({_id: variation.accessory_id}, {$inc: {
              rented: rentedTotal
            }})
          }
        })
        // data.variations.forEach((variation) => {
        //
        //
        //
        //
        //
        //   // var newAccessory = Accessories.findOne({_id: accessory._id});
        //   // accessory.variations.forEach((variation) => {
        //   //   var varRented = 0;
        //   //   var oldVariation = newAccessory.variations.find((oldVar) => {
        //   //     return oldVar._id === variation._id;
        //   //   })
        //   //   variation.places.forEach((fromPlace) => {
        //   //     var oldPlace = oldVariation.places.find((oldPl) => {
        //   //       return oldPl._id === fromPlace._id;
        //   //     })
        //   //     varRented += fromPlace.quantity;
        //   //     oldPlace.available -= fromPlace.quantity;
        //   //     if (oldPlace.available < 0) {
        //   //       throw new Meteor.Error('stock-unavailable', '', {
        //   //         _id: newAccessory._id,
        //   //         type: newAccessory.type,
        //   //         item: newAccessory.description,
        //   //         extra: variation.description,
        //   //         place: fromPlace.description
        //   //       })
        //   //     }
        //   //   })
        //   //   oldVariation.rented += varRented;
        //   // })
        //   // if (!isSimulation) {
        //   //   Accessories.update({_id: accessory._id},
        //   //     {$set: newAccessory})
        //   // }
        // })
        var altDataPacks = tools.deepCopy(data.packs);
        data.packs.forEach((pack, p) => {
          if (pack.locked) {
            if (!isSimulation) {
              Packs.update({_id: pack._id}, {$set: {
                rented: true,
                place: {
                  _id: '',
                  description: ''
                }
              }});
            }
          } else {
            pack.modules.forEach((module, m) => {
              var newModule = Modules.findOne({_id: module._id});
              var modRented = 0;
              module.places.forEach((fromPlace) => {
                var oldPlace = newModule.places.find((oldPl) => {
                  return oldPl._id === fromPlace._id;
                })
                modRented += fromPlace.quantity;
                oldPlace.available -= fromPlace.quantity;
                if (oldPlace.available < 0) {
                  throw new Meteor.Error('stock-unavailable', '', newModule)
                }
              })
              newModule.rented += modRented;
              altDataPacks[p].modules[m].quantity = modRented;
              delete altDataPacks[p].modules[m].places;
              if (!isSimulation) {
                Modules.update({_id: newModule._id},
                  {$set: newModule})
              }
            })
            if (!isSimulation) {
              Packs.insert({
                ...altDataPacks[p],
                visible: true,
                rented: true,
                place: {
                  _id: '',
                  description: ''
                }
              });
            }
          }
        })
      }

      executeTransactions(true);
      executeTransactions(false);
      console.dir(shipping, {depth: null})
      Contracts.update({ _id },
        { $set: { shipping }
      });
      return _id;
    },
    'contracts.shipping.receive'(data) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
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
        type: 'receive'
      }

      const executeTransactions = (isSimulation) => {
        data.series.forEach((series) => {
          if (isSimulation) {
            var isRented = false;
            for (var i = shipping.length-1; i >= 0; i--) {
              var found = shipping[i].series.find((item) => {
                return item._id === series._id
              })
              if (found) {
                isRented = !!shipping.type === 'send';
                break;
              }
            }
            if (isRented) throw new Meteor.Error('stock-unavailable', '', {
              _id: series._id,
              item: series
            })
          } else {
            Series.update({_id: series._id}, {$set: {
              place: {
                _id: series.place._id,
                description: series.place.description
              },
              rented: false
            }})
          }
        })
        data.variations.forEach((variation) => {
          var varFromDb = Variations.findOne({_id: variation._id});
          var found = varFromDb.places.find((place) => {
            return place._id === variation.place._id;
          })
          if (found) {
            found.available += variation.quantity;
          } else {
            varFromDb.places.push({
              _id: variation.place._id,
              description: variation.place.description,
              available: variation.quantity,
              inactive: 0
            })
          }
          variation.places = [{
            ...variation.place,
            quantity: variation.quantity
          }];

          if (!isSimulation) {
            Variations.update({_id: variation._id}, {$set: varFromDb})
            Accessories.update({_id: variation.accessory._id},
              {$inc: {
                available: variation.quantity,
                rented: -variation.quantity
              }})
            }
          })
        data.packs.forEach((pack) => {
          if (isSimulation) {
            var isRented = false;
            for (var i = shipping.length-1; i >= 0; i--) {
              var found = shipping[i].packs.find((item) => {
                return item._id === pack._id
              })
              if (found) {
                isRented = !!shipping.type === 'send';
                break;
              }
            }
            if (isRented) throw new Meteor.Error('stock-unavailable', '', {
              _id: pack._id,
              item: pack
            })
          } else {
            if (pack.unmount) {
              pack.modules.forEach((module) => {
                var moduleFromDb = Modules.findOne({_id: module._id});
                var received = 0;
                module.places.forEach((place) => {
                  received += place.quantity;
                  var found = moduleFromDb.places.find((dbPlace) => {
                    return dbPlace._id === place._id;
                  })
                  if (found) {
                    found.available += module.quantity;
                  } else {
                    moduleFromDb.places.push({
                      _id: place._id,
                      description: place.description,
                      available: place.quantity,
                      inactive: 0
                    })
                  }
                })
                module.rented -= received;
                if (module.rented < 0) {
                  throw new Meteor.Error('stock-unavailable', '', {
                    _id: module._id,
                    item: module
                  })
                }
                if (!isSimulation) {
                  Modules.update({_id: module._id}, {$set: moduleFromDb});
                }
              })
              Packs.update({_id: pack._id}, {$set: {
                place: {
                  _id: pack.place._id,
                  description: pack.place.description
                },
                rented: false,
                visible: false
              }})
            } else {
              Packs.update({_id: pack._id}, {$set: {
                place: {
                  _id: pack.place._id,
                  description: pack.place.description
                },
                rented: false
              }})
            }
          }
        })
      }

      executeTransactions(true);
      executeTransactions(false);

      shipping.push(data);

      Contracts.update({ _id },
        { $set: { shipping }
      });
      return _id;
    },
    'contracts.billing.update' (_id, billing, type) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
      }
      var contract = Contracts.findOne({_id});
      var snapshot = contract.snapshots[contract.activeVersion];
      snapshot[type] = billing;
      Contracts.update({_id}, { $set: contract })
      return _id;
    }
  })
}