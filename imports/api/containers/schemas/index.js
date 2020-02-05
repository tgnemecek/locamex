import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

var options = {
  clean: {
    trimStrings: true,
    removeEmptyStrings: false
  },
  check
}

var insertFixedSchema = new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  price: Number,
  restitution: Number,
  flyer: Boolean,
  visible: Boolean
}, options)

var updateFixedSchema = new SimpleSchema({
  description: String,
  price: Number,
  restitution: Number
}, options);

var insertModularSchema = new SimpleSchema({
  _id: String,
  type: String,
  description: String,
  price: Number,
  restitution: Number,
  allowedModules: Array,
  'allowedModules.$': String,
  flyer: Boolean,
  visible: Boolean
}, options)

var updateModularSchema = new SimpleSchema({
  description: String,
  price: Number,
  restitution: Number,
  allowedModules: Array,
  'allowedModules.$': String
}, options);

var snapshotsSchema = new SimpleSchema({
  snapshots: Array,
  'snapshots.$': String
})

var hideSchema = new SimpleSchema({
  visible: Boolean
})

module.exports = {
  insertFixedSchema,
  insertModularSchema,
  updateFixedSchema,
  updateModularSchema,
  hideSchema
}