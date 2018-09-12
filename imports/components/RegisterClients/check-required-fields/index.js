const requiredFieldsCompany = [
  "description",
  "type",
  "registry",
  "officialName",
  "registryES",
  "registryMU"
]

const requiredFieldsPerson = [
  "description",
  "type",
  "registry",
  "rg",
  "phone1",
  "email"
]

const requiredFieldsAddress = [
  "street",
  "city",
  "cep",
  "number",
  "state"
]

const requiredFieldsFirstContact = [
  "name",
  "cpf",
  "rg",
  "email",
  "phone1"
]

export default function checkRequiredFields (state) {
  var currentFields;
  var emptyFields = [];
  var specialFields = ["address", "contacts"];

  if (state.type == 'company') {
    currentFields = requiredFieldsCompany;
  } else currentFields = requiredFieldsPerson;

  Object.keys(state).forEach((key) => {
    if (!specialFields.includes(key)) {
      if (currentFields.includes(key)) {
        if (!state[key]) {
          emptyFields.push(key);
        }
      }
    } else {
      var object;
      var requiredSpecialFields;
      if (key == "address") {
        object = state[key];
        requiredSpecialFields = requiredFieldsAddress;
      } else if (key == "contacts") {
        object = state[key][0];
        requiredSpecialFields = requiredFieldsFirstContact;
      }
      Object.keys(object).forEach((innerKey) => {
        if (requiredSpecialFields.includes(innerKey)) {
          if (!object[innerKey]) {
            emptyFields.push(innerKey);
          }
        }
      })
    }
  })
  if (emptyFields.length > 0) {
    return emptyFields;
  } else return true;
}

