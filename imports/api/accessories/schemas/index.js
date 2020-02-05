import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

var stockSchema = new SimpleSchema({
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
},
{
  clean: { trimStrings: true, removeEmptyStrings: false },
  check
}
)

var updateSchema = new SimpleSchema({
  description: String,
  price: Number,
  restitution: Number,
  observations: String
},
{
  clean: { trimStrings: true, removeEmptyStrings: false },
  check
}
).extend(stockSchema);

var imagesSchema = new SimpleSchema({
  images: Array,
  'images.$': String
})

var hideSchema = new SimpleSchema({
  'visible': Boolean
})

var insertSchema = new SimpleSchema({
  _id: String,
  type: String
},
{
  clean: { trimStrings: true, removeEmptyStrings: false },
  check
}).extend(updateSchema).extend(imagesSchema).extend(hideSchema);

module.exports = {
  insertSchema,
  updateSchema,
  stockSchema,
  imagesSchema,
  hideSchema
}