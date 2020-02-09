import SimpleSchema from 'simpl-schema';

export const addressSchema = new SimpleSchema({
  address: Object,
  'address.number': String,
  'address.street': String,
  'address.city': String,
  'address.state': String,
  'address.cep': String,
  'address.additional': {
    type: String,
    optional: true
  },
})