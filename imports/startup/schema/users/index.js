import SimpleSchema from 'simpl-schema';

var username = {
  type: String,
  min: 4,
  max: 20
}

var password = {
  type: String,
  min: 4,
  max: 20
}

var profile = {
  profile: Object,
  'profile.firstName': String,
  'profile.lastName': String,
  'profile.type': String
}

var optionals = {
  createdAt: {
    type: Date,
    optional: true
  },
  services: {
    type: Object,
    blackbox: true,
    optional: true
  }
}

export default {
  insert: {
    username,
    password,
    ...profile,
    ...optionals,
    email: SimpleSchema.RegEx.Email,
    visible: Boolean
  },
  update: {
    username,
    ...profile,
    ...optionals,
    email: SimpleSchema.RegEx.Email,
    profile: Object
  },
  password: {
    password
  }
}