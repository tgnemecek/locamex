import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';
import { Accessories } from '/imports/api/accessories/index';
import tools from '/imports/startup/tools/index';

export const Variations = new Mongo.Collection('variations');
Variations.attachSchema(new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  observations: {
    type: String,
    optional: true
  },
  accessory: Object,
  'accessory._id': String,
  'accessory.description': String,
  rented: SimpleSchema.Integer,
  image: {
    type: String,
    optional: true
  },
  visible: Boolean,
  places: Array,
  'places.$': Object,
  'places.$._id': String,
  'places.$.description': String,
  'places.$.available': SimpleSchema.Integer,
  'places.$.inactive': SimpleSchema.Integer
}))

Variations.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('variationsPub', (args) => {
    args = { query: {}, ...args}
    if (!Meteor.userId()) throw new Meteor.Error('unauthorized');
    if (!tools.isReadAllowed('variations')) return [];
    return Variations.find(args.query);
  })

  Meteor.methods({
    'variations.update'(accessory) {
      if (!Meteor.userId() || !tools.isWriteAllowed('variations')) {
        throw new Meteor.Error('unauthorized');
      }
      accessory.variations.forEach((variation) => {
        var found = Variations.findOne({_id: variation._id});
        if (found) {
          Variations.update({_id: variation._id}, {$set: {
            description: variation.description,
            observations: variation.observations,
            accessory: {
              _id: accessory._id,
              description: accessory.description
            }
          }})
        } else {
          var data = {
            _id: tools.generateId(),
            type: "variation",
            accessory: {
              _id: accessory._id,
              description: accessory.description
            },
            description: variation.description,
            observations: variation.observations,
            rented: 0,
            image: '',
            places: [],
            visible: true
          }
          Variations.insert(data);
        }
      })
      return true;
    },
    'variations.update.stock'(variations) {
      if (!Meteor.userId() || !tools.isWriteAllowed('variations')) {
        throw new Meteor.Error('unauthorized');
      }
      var available = 0;
      var inactive = 0;
      variations.forEach((variation) => {
        Variations.update({_id: variation._id}, {$set: {
          places: variation.places.filter((place) => {
            available += place.available;
            inactive += place.inactive;
            return place.available || place.inactive;
          })
        }})
      })
      Accessories.update({_id: variations[0].accessory._id},
        {$set: {available, inactive}})
      return true;
    },
    'variations.update.image'(_id, dataUrl) {
      if (!Meteor.userId() || !tools.isWriteAllowed('variations')) {
        throw new Meteor.Error('unauthorized');
      }
      var variation = Variations.findOne({_id});
      var extension = ".jpg";
      var date = new Date();
      var formattedDate = moment(date).format("YYYY-MM-DD");
      var directory = `user-uploads/images/variations
        /${_id}/${formattedDate}/`;
      var name = `variation-${_id}${extension}`;
      var key = directory + name;

      return new Promise((resolve, reject) => {
        return new Promise((resolve1, reject1) => {
          if (!variation.image) resolve1();
          Meteor.call('aws.delete.directory', variation.image, (err, res) => {
            if (err) throw new Meteor.Error(err);
            if (res) resolve1();
          })
        }).then(() => {
          Meteor.call('aws.write', dataUrl, key, (err, data) => {
            if (err) throw new Meteor.Error(err);
            if (data) {
              var image = data.Location;
              Variations.update({_id}, {$set: {image}} );
              resolve(_id)
            }
          })
        })
      })
    }
  });
}