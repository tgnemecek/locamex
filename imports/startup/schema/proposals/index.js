import SimpleSchema from 'simpl-schema';

var partial = {
  active: Boolean,
  createdById: String,
  createdByName: String,
  client: Object,
  'client.description': String,
  'client.name': String,
  'client.email': String,
  'client.phone': String,
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
  deliveryAddress: Object,
  'deliveryAddress.street': String,
  'deliveryAddress.cep': String,
  'deliveryAddress.city': String,
  'deliveryAddress.state': String,
  'deliveryAddress.number': String,
  'deliveryAddress.additional': String,
  dates: Object,
  'dates.creationDate': Date,
  'dates.startDate': Date,
  'dates.duration': SimpleSchema.Integer,
  'dates.timeUnit': {
    type: String,
    allowedValues: ["months", "days"]
  }
}

export default {
  partial
}