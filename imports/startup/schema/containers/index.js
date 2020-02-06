import SimpleSchema from 'simpl-schema';

var partial = {
  _id: String,
  type: String,
  description: String,
  price: Number,
  restitution: Number
}

var fullFixed = {
  ...partial,
  flyer: Boolean,
  visible: Boolean
}

var updateFixed = {
  description: String,
  price: Number,
  restitution: Number
}

var fullModular = {
  ...partial,
  allowedModules: Array,
  'allowedModules.$': String,
  flyer: Boolean,
  visible: Boolean
}

var updateModular = {
  description: String,
  price: Number,
  restitution: Number,
  allowedModules: Array,
  'allowedModules.$': String
}

var snapshots = {
  snapshots: Array,
  'snapshots.$': String
}

var hide = {
  visible: Boolean
}

export default {
  partial,
  fullFixed,
  fullModular,
  updateFixed,
  updateModular,
  hide
}