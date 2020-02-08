import SimpleSchema from 'simpl-schema';

var full = {
  _id: String,
  type: String,

  container: Object,
  'container._id': String,
  'container.description': String,
  place: Object,
  'place._id': String,
  'place.description': String,

  observations: String,
  snapshots: Array,
  'snapshots.$': String,
  visible: Boolean
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
  visible: Boolean
}

export default {
  full,
  update,
  snapshots,
  hide
}