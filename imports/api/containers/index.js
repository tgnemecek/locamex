import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Contracts } from '/imports/api/contracts/index';
import { Proposals } from '/imports/api/proposals/index';
import { Series } from '/imports/api/series/index';
import { modulesSchema } from '/imports/api/modules/index';
import tools from '/imports/startup/tools/index';

export const Containers = new Mongo.Collection('containers');
export const containersSchema = new SimpleSchema({
  _id: String,
  description: String,
  type: String,
  price: Number,
  restitution: Number,
  flyer: {
    type: Object,
    optional: true
  },
  'flyer.paragraphs': Array,
  'flyer.paragraphs.$': {
    type: String,
    optional: true
  },
  'flyer.images': Array,
  'flyer.images.$': String,
  allowedModules: {
    type: Array,
    optional: true
  },
  'allowedModules.$': Object,
  'allowedModules.$._id': String,
  'allowedModules.$.description': String,

  visible: Boolean
})
Containers.attachSchema(containersSchema);

Containers.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('containersPub', () => {
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('containers')) return [];
    return Containers.find({ visible: true }, {sort: { description: 1 }});
  })
  Meteor.methods({
    // FIXED
    'containers.fixed.insert' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      const _id = tools.generateId();
      var data = {
        _id,
        description: state.description,
        type: "fixed",
        price: state.price,
        restitution: state.restitution,
        visible: true
      }
      Containers.insert(data);

      return true;
    },

    'containers.fixed.update' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution
      }

      Containers.update({ _id: state._id }, { $set: data });
      updateReferences(state._id, {
        description: data.description,
        restitution: data.restitution
      }, [Proposals, Contracts])

      return true;
    },

    // MODULAR
    'containers.modular.insert' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      const _id = tools.generateId();
      var data = {
        _id,
        description: state.description,
        type: "modular",

        allowedModules: state.allowedModules,

        price: state.price,
        restitution: state.restitution,

        visible: true
      }
      Containers.insert(data);

      return true;
    },

    'containers.modular.update' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      var data = {
        description: state.description,
        price: state.price,
        restitution: state.restitution,
        allowedModules: state.allowedModules
      }
      Containers.update({ _id: state._id }, { $set: data });
      updateReferences(state._id, 'containers', {
        description: data.description,
        restitution: data.restitution
      }, [Proposals, Contracts]);

      return true;
    },

    'containers.hide' (_id) {
      var container = Containers.findOne({_id});
      var verification = false;
      if (container.type === 'fixed') {
        var series = Series.find({'container._id': _id}).fetch() || [];
        verification = series.every((series) => {
          return !series.rented && !series.visible;
        })
        if (!verification) throw new Meteor.Error('stock-must-be-zero');
      }
      var contracts = Contracts.find({status: "active"}).fetch() || [];
      var errorContractId = '';
      verification = contracts.every((contract) => {
        var snapshot = contract.snapshots.find((snapshot) => {
          return snapshot.active;
        })
        errorContractId = contract._id;
        return !snapshot.containers.find((item) => {
          return item._id === _id;
        })
      })
      if (!verification) {
        throw new Meteor.Error('active-contract-using-item', errorContractId);
      }
      Containers.update({_id}, {$set: {visible: false}})
      return true;
    },

    // OTHER
    'containers.update.flyer' (state) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      var flyer = {};
      flyer.paragraphs = state.hasFlyer ? state.paragraphs : [];
      if (!state.hasFlyer) {
        flyer = null;
      } else {
        flyer.paragraphs = state.paragraphs;
        if (state.newImages) {
          flyer.images = state.images;
        } else {
          var item = Containers.findOne({ _id: state._id });
          flyer.images = item.flyer ? item.flyer.images : [];
        }
      }

      updateReferences(state._id, {flyer}, [Proposals])

      Containers.update({ _id: state._id }, {$set: { flyer }})

      return state._id;
    },
    'containers.delete.flyer.images' (_id) {
      if (!Meteor.userId() || !tools.isWriteAllowed('containers')) {
        throw new Meteor.Error('unauthorized');
      }
      return new Promise((resolve, reject) => {
        var item = Containers.findOne({ _id });
        if (!item.flyer) resolve(_id);

        Meteor.call('aws.delete.objects', item.flyer.images,
        (err, res) => {
          if (err) console.log(err);
          if (res) {

            resolve(_id);
          }
        })
      })
    },
  })

  function updateReferences(_id, changes, Databases) {
    Databases.forEach((Database) => {
      Database.find({status: "inactive"})
      .forEach((doc) => {
          doc.snapshots.forEach((snapshot) => {
            snapshot.containers = snapshot.containers
            .map((item) => {
              if (item._id === _id) {
                return {
                  ...item,
                  ...changes
                }
              } else return item;
            })
          })
          Database.update({ _id: doc._id },
            {$set: doc});
      })
    })
  }
}
