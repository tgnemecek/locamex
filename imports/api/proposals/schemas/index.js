import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

var options = {
  clean: {
    trimStrings: true,
    removeEmptyStrings: false
  },
  check
}

var variations = {
  variations: Array,
  'variations.$': Object,
  'variations.$._id': String,
  'variations.$.description': String,
  'variations.$.observations': String,
  'variations.$.rented': SimpleSchema.Integer,
  'variations.$.place': Array,
  'variations.$.place.$': Object,
  'variations.$.place.$._id': String,
  'variations.$.place.$.available': SimpleSchema.Integer,
  'variations.$.place.$.inactive': SimpleSchema.Integer,
  'variations.$.visible': Boolean
}

var insertSchema = new SimpleSchema({
  _id: String,
  type: String,

  description: String,
  price: Number,
  restitution: Number,
  observations: String,

  ...variations,

  images: Array,
  'images.$': String,

  'visible': Boolean
}, options)

var updateSchema = new SimpleSchema({
  description: String,
  price: Number,
  restitution: Number,
  observations: String,
  ...variations
}, options);

var imagesSchema = new SimpleSchema({
  images: Array,
  'images.$': String
})

var stockSchema = new SimpleSchema(variations, options)

var hideSchema = new SimpleSchema({
  'visible': Boolean
})

module.exports = {
  insertSchema,
  updateSchema,
  stockSchema,
  imagesSchema,
  hideSchema
}