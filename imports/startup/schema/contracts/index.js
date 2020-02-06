import SimpleSchema from 'simpl-schema';

var partial = {
  active: Boolean,
  createdById: String,
  createdByName: String,
  discount: {
    type: Number,
    min: 0,
    max: 1
  },
  observations: Object,
  'observations.internal': String,
  'observations.external': String,
  'observations.conditions': {
    type: String,
    optional: true
  },
  dates: Object,
  'dates.creationDate': Date,
  'dates.startDate': Date,
  'dates.duration': SimpleSchema.Integer,
  'dates.timeUnit': {
    type: String,
    allowedValues: ["months", "days"]
  },
  billingProducts: Array,
  'billingProducts.$': {
    type: Object,
    blackbox: true
  },
  billingServices: Array,
  'billingServices.$': {
    type: Object,
    blackbox: true
  }
}

export default {
  partial
}