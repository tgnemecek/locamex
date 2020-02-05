import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

var options = {
  clean: {
    trimStrings: true,
    removeEmptyStrings: false
  },
  check
}

var insertSchema = new SimpleSchema({
  _id: String,
  type: String,

  containerId: String,
  containerDescription: String,
  placeId: String,
  placeDescription: String,
  observations: String,
  snapshots: Array,
  'snapshots.$': String,
  'visible': Boolean
}, options)

var updateSchema = new SimpleSchema({
  placeId: String,
  placeDescription: String,
  observations: String
}, options);

var snapshotsSchema = new SimpleSchema({
  snapshots: Array,
  'snapshots.$': String
})

var hideSchema = new SimpleSchema({
  'visible': Boolean
})

module.exports = {
  insertSchema,
  updateSchema,
  snapshotsSchema,
  hideSchema
}