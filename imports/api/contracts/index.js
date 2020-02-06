import { Mongo } from 'meteor/mongo';
import tools from '/imports/startup/tools/index';
import schema from '/imports/startup/schema/index';

import { Proposals } from '/imports/api/proposals/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

export const Contracts = new Mongo.Collection('contracts');

Contracts.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('contractsPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    return Contracts.find({}, {sort: { _id: -1 }});
  })

  Meteor.methods({
    'contracts.insert'(proposalId) {
      var proposal = Proposals.findOne({ _id: proposalId });
      var snapshotIndex;
      var snapshot = proposal.snapshots.find((snapshot, i) => {
        if (snapshot.active === true) {
          snapshotIndex = i;
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
        proposalNumber: proposalId + "." + (snapshotIndex+1),
        shipping: [],
        visible: true,
        snapshots: [{
          active: false,
          createdById: user._id,
          createdByName: `${user.firstName} ${user.lastName}`,
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
          discount: snapshot.discount,
          observations: {
            internal: '',
            external: ''
          },
          deliveryAddress: {
            street: '',
            cep: '',
            city: '',
            state: '',
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

      schema('contracts', 'full').clean(contract.snapshots[0])
      schema('contracts', 'full').validate(contract.snapshots[0]);

      Contracts.insert(contract);
      Meteor.call('history.insert', contract, 'contracts.insert');
      return _id;
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //
      // const prefix = new Date().getFullYear();
      // var offset = 32;
      // var suffix = Contracts.find({ _id: { $regex: new RegExp(prefix)} }).count() + offset;
      // suffix = suffix.toString().padStart(3, '0');;
      // const _id = prefix + "-" + suffix;
      //
      // data._id = _id;
      // data.visible = true;
      //
      // Contracts.insert(data);
      // Meteor.call('history.insert', data, 'contracts.insert');
      // return _id;
    },
    'contracts.update'(snapshot) {
      var _id = snapshot._id;
      var index = snapshot.version;
      var data = Contracts.findOne({ _id });
      var hasChanged = !tools.compare(data.snapshots[index], snapshot, "activeVersion");
      if (!hasChanged) return { hasChanged: false, contract: data };

      const newSnapshot = {
        ...snapshot,
        _id: undefined,
        version: undefined,
        status: undefined,
        activeVersion: undefined,
        shipping: undefined,

        containers: snapshot.containers,
        accessories: snapshot.accessories,
        services: snapshot.services
      };

      data.snapshots.push(newSnapshot);
      data.activeVersion = Number(snapshot.version)+1;

      Contracts.update({ _id }, { $set: data });
      Meteor.call('history.insert', data, 'contracts.update');
      return { hasChanged: true, contract: data };
    },
    'contracts.activate'(contract) {
      var _id = contract._id;
      Contracts.update({ _id }, { $set: {
        status: "active",
        activeVersion: Number(contract.version)
      } })
      Meteor.call('history.insert', { _id }, 'contracts.activate');
      return { _id };
    },
    'contracts.finalize'(_id) {
      Contracts.update({ _id }, { $set: { status: "finalized" } } );
      Meteor.call('history.insert', { _id }, 'contracts.finalize');
      return _id;
    },
    'contracts.cancel'(_id, proposalId) {
      Proposals.update({ _id: proposalId }, { $set: {status: "cancelled"} });
      Contracts.update({ _id }, { $set: { status: "cancelled" } } );
      Meteor.call('history.insert', { _id }, 'contracts.cancel');
      return _id;
    },
    'contracts.shipping.send'(master) {
      var _id = master._id;
      var oldShipping = Contracts.findOne({ _id }).shipping;

      var shipping = [...oldShipping];

      shipping.push({
        _id: tools.generateId(),
        date: new Date(),
        type: 'send',
        fixed: master.fixed.filter((item) => {
          return !!item.seriesId;
        }),
        packs: master.packs.filter((pack) => {
          var count = 0;
          pack.modules.filter((module) => {
            count += module.selected.length;
            return !!module.selected.length;
          })
          return !!count;
        }),
        accessories: master.accessories.filter((item) => {
          delete item.renting;
          return !!item.selected.length;
        })
      });

      var currentShipping = shipping[shipping.length-1];

      function updateModule(product, module) {
        var place = [...product.place];
        var rented = product.rented;
        module.selected.forEach((moduleSelected) => {
          var exists = place.findIndex((item) => item._id === moduleSelected.place);
          if (exists > -1) {
            place[exists].available -= moduleSelected.selected;
            if (place[exists].available < 0) throw new Meteor.Error('product-already-rented');
            rented = rented + moduleSelected.selected;
          } else throw new Meteor.Error('product-already-rented');
        })
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
          accessory.selected.forEach((accessorySelected) => {
            if (i === accessorySelected.variationIndex) {
              var exists = place.findIndex((item) => item._id === accessorySelected.place);
              if (exists > -1) {
                place[exists].available = place[exists].available - accessorySelected.selected;
                if (place[exists].available < 0) throw new Meteor.Error('product-already-rented');
                rented = rented + accessorySelected.selected;
              } else throw new Meteor.Error('product-already-rented' + accessorySelected.place);
            }
          })
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

      const executeRent = (isSimulation) => {
        currentShipping.fixed.forEach((fixed) => {
          var productFromDatabase = Series.findOne({ _id: fixed.seriesId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          if (productFromDatabase.place === "rented") throw new Meteor.Error('product-already-rented');
          if (!isSimulation) Meteor.call('series.update', {place: "rented"}, fixed.seriesId);
        })
        currentShipping.packs.forEach((pack) => {
          pack.modules.forEach((module) => {
            var productFromDatabase = Modules.findOne({ _id: module.productId });
            if (!productFromDatabase) throw new Meteor.Error('product-not-found');
            productFromDatabase = updateModule(productFromDatabase, module);
            if (!isSimulation) Meteor.call('modules.shipping.send', productFromDatabase);
          })
        })
        currentShipping.accessories.forEach((accessory) => {
          var productFromDatabase = Accessories.findOne({ _id: accessory.productId });
          if (!productFromDatabase) throw new Meteor.Error('product-not-found');
          productFromDatabase = updateAccessory(productFromDatabase, accessory);
          if (!isSimulation) Meteor.call('accessories.shipping.send', productFromDatabase);
        })
        return true;
      }

      executeRent(true);
      // executeRent(false);

      Contracts.update({ _id }, { $set: { shipping } });
      Meteor.call('history.insert',
        {...currentShipping, contractId: _id},
        'contracts.shipping.send');
      return _id;
    },
    'contracts.shipping.receive'(master) {
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
      var contract = Contracts.findOne({_id});
      var snapshot = contract.snapshots[contract.activeVersion];
      snapshot[type] = billing;
      Contracts.update({_id}, { $set: contract })
      return _id;
    }
  })
}