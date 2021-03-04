import SimpleSchema from "simpl-schema";

export const addressSchema = new SimpleSchema({
  number: String,
  street: String,
  city: String,
  state: String,
  cep: String,
  additional: {
    type: String,
    optional: true,
  },
});
