import SimpleSchema from 'simpl-schema';

var full = {
  _id: String,
  type: String,
  description: String,
  price: Number,
  visible: Boolean
}

var update = {
  description: String,
  price: Number
}

var hide = {
  visible: Boolean
}

export default {
  full,
  update,
  hide
}