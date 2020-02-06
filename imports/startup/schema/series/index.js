import SimpleSchema from 'simpl-schema';

var insert = {
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
}

var update = {
  placeId: String,
  placeDescription: String,
  observations: String
}

var snapshots = {
  snapshots: Array,
  'snapshots.$': String
}

var hide = {
  'visible': Boolean
}

export default {
  insert,
  update,
  snapshots,
  hide
}