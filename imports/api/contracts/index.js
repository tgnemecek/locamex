import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import tools from '/imports/startup/tools/index';
import { accountsSchema } from '/imports/api/accounts/index';
import { Proposals } from '/imports/api/proposals/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Accessories } from '/imports/api/accessories/index';

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

  'shipping.$.accessories': Array,
  'shipping.$.accessories.$': Object,
  'shipping.$.accessories.$._id': String,
  'shipping.$.accessories.$.description': String,
  'shipping.$.accessories.$.type': String,
  'shipping.$.accessories.$.variations': Array,
  'shipping.$.accessories.$.variations.$': Object,
  'shipping.$.accessories.$.variations.$._id': String,
  'shipping.$.accessories.$.variations.$.description': String,
  'shipping.$.accessories.$.variations.$.observations': {
    type: String,
    optional: true
  },
  'shipping.$.accessories.$.variations.$.type': String,
  'shipping.$.accessories.$.variations.$.from': Array,
  'shipping.$.accessories.$.variations.$.from.$': Object,
  'shipping.$.accessories.$.variations.$.from.$._id': String,
  'shipping.$.accessories.$.variations.$.from.$.description': String,
  'shipping.$.accessories.$.variations.$.from.$.quantity': SimpleSchema.Integer,

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
  'shipping.$.packs.$.modules.$.quantity': SimpleSchema.Integer,
  'shipping.$.packs.$.modules.$.type': String,
  'shipping.$.packs.$.modules.$.from': Array,
  'shipping.$.packs.$.modules.$.from.$': Object,
  'shipping.$.packs.$.modules.$.from.$._id': String,
  'shipping.$.packs.$.modules.$.from.$.description': String,
  'shipping.$.packs.$.modules.$.from.$.quantity': SimpleSchema.Integer,

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
        accessories: data.accessories.filter((item) => {
          return item.variations.length;
        }),
        packs: data.packs.filter((item) => {
          return item.modules.length;
        }).map((item, i) => {
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
        data.accessories.forEach((accessory) => {
          var newAccessory = Accessories.findOne({_id: accessory._id});
          accessory.variations.forEach((variation) => {
            var varRented = 0;
            var oldVariation = newAccessory.variations.find((oldVar) => {
              return oldVar._id === variation._id;
            })
            variation.from.forEach((fromPlace) => {
              var oldPlace = oldVariation.places.find((oldPl) => {
                return oldPl._id === fromPlace._id;
              })
              varRented += fromPlace.quantity;
              oldPlace.available -= fromPlace.quantity;
              if (oldPlace.available < 0) {
                throw new Meteor.Error('stock-unavailable', '', {
                  _id: newAccessory._id,
                  type: newAccessory.type,
                  item: newAccessory.description,
                  extra: variation.description,
                  place: fromPlace.description
                })
              }
            })
            oldVariation.rented += varRented;
          })
          if (!isSimulation) {
            Accessories.update({_id: accessory._id},
              {$set: newAccessory})
          }
        })
        data.packs.forEach((pack) => {
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
            pack.modules.forEach((module) => {
              var newModule = Modules.findOne({_id: module._id});
              var modRented = 0;
              module.from.forEach((fromPlace) => {
                var oldPlace = newModule.places.find((oldPl) => {
                  return oldPl._id === fromPlace._id;
                })
                modRented += fromPlace.quantity;
                oldPlace.available -= fromPlace.quantity;
                if (oldPlace.available < 0) {
                  throw new Meteor.Error('stock-unavailable', '', {
                    _id: newModule._id,
                    type: newModule.type,
                    item: newModule.description,
                    place: fromPlace.description
                  })
                }
              })
              newModule.rented += modRented;
              if (!isSimulation) {
                Modules.update({_id: newModule._id},
                  {$set: newModule})
              }
            })
            if (!isSimulation) {
              delete pack._id;
              Packs.insert({
                ...pack,
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

      Contracts.update({ _id },
        { $set: { shipping }
      });
      return _id;
    },
    'contracts.shipping.receive'(master) {
      if (!Meteor.userId() || !tools.isWriteAllowed('contracts')) {
        throw new Meteor.Error('unauthorized');
      }
      var _id = master._id;
      var oldShipping = Contracts.findOne({ _id }).shipping;

      var shipping = [...oldShipping];

      shipping.push({
        _id: tools.generateId(),
        date: new Date(),
        type: 'receive',
        fixed: master.fixed.filter((item) => {
          return !!item.place;
        }),
        packs: master.packs,
        accessories: master.accessories
      });

      var currentShipping = shipping[shipping.length-1];

      function updateModule(product, module) {
        var place = [...product.place];
        var rented = product.rented;
        var exists = place.findIndex((item) => item._id === module.place);
        if (exists > -1) {
          place[exists].available += module.selected;
        } else {
          place.push({
            _id: module.place,
            available: module.selected,
            inactive: 0
          })
        }
        rented = rented - module.selected;
        return {
          ...product,
          rented,
          place
        }
      }

      function updateAccessory(product, accessory) {
        var variations = product.variations.map((variation, i) => {
          var place = [...variation.place];
          var rented = variation.rented;

          if (i === accessory.variationIndex) {
            var exists = place.findIndex((item) => item._id === accessory.place);
            if (exists > -1) {
              place[exists].available = place[exists].available + accessory.selected;
            } else {
              place.push({
                _id: accessory.place,
                available: accessory.selected,
                inactive: 0
              })
            }
            rented = rented - accessory.selected;
          }
          return {
            ...variation,
            rented,
            place
          }
        })
        return {
          ...product,
          variations
        }
      }

      const executeReceive = (isSimulation) => {
        currentShipping.fixed.forEach((fixed) => {
          if (!isSimulation) Meteor.call('series.update', {place: fixed.place}, fixed.seriesId);
        })
        currentShipping.packs.forEach((pack) => {
          pack.modules.forEach((module) => {
            if (module.place) {
              var productFromDatabase = Modules.findOne({ _id: module.productId });
              if (!productFromDatabase) throw new Meteor.Error('product-not-found');
              productFromDatabase = updateModule(productFromDatabase, module);
              if (!isSimulation) Meteor.call('modules.shipping.receive', productFromDatabase);
            }
          })
        })
        currentShipping.accessories.forEach((accessory) => {
          var productFromDatabase = Accessories.findOne({ _id: accessory.productId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          productFromDatabase = updateAccessory(productFromDatabase, accessory);
          if (!isSimulation) Meteor.call('accessories.shipping.receive', productFromDatabase);
        })
        return true;
      }

      executeReceive(true);
      // executeReceive(false);

      Contracts.update({ _id }, { $set: { shipping } });
      Meteor.call('history.insert',
      {...currentShipping, contractId: _id}, 'contracts.shipping.receive');
      return true;
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