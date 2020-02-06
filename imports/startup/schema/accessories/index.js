import SimpleSchema from 'simpl-schema';

var stock = {
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

var full = {
  _id: String,
  type: String,

  description: String,
  price: Number,
  restitution: Number,
  observations: String,

  ...stock,

  images: Array,
  'images.$': String,

  'visible': Boolean
}

var update = {
  description: String,
  price: Number,
  restitution: Number,
  observations: String,
  ...stock
}

var images = {
  images: Array,
  'images.$': String
}

var hide = {
  'visible': Boolean
}

export default {
  full,
  update,
  stock,
  images,
  hide
}