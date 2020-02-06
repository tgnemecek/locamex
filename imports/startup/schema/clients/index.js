import SimpleSchema from 'simpl-schema';

var partial = {
  _id: String,
  description: String,
  type: String,
  registry: String,
  contacts: Array,
  'contacts.$': Object,
  'contacts.$.name': String,
  'contacts.$.phone1': String,
  'contacts.$.phone2': String,
  'contacts.$.email': String,
  'contacts.$.cpf': String,
  'contacts.$.rg': String,
  'contacts.$.visible': Boolean
}

// var partialCompany = {
//   ...base,
//   officialName: String,
//   registryES: String,
//   registryMU: String,
//   observations: String,
// }

export default {
  partial
}