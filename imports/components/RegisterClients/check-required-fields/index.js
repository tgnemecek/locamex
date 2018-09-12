import tools from '/imports/startup/tools/index';

const requiredFieldsCompany = [
  "description",
  "type",
  "registry",
  "officialName",
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

const verificationFields = [
  "registry",
  "email",
  "cpf"
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
        } else {
          if (verificationFields.includes(key)) {
            var type = key;
            if (key == "registry") type = state.type == "company" ? "cnpj" : "cpf";
            if (!validateField(state[key], type)) emptyFields.push(key);
          }
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
      if (object) {
        Object.keys(object).forEach((innerKey) => {
          if (requiredSpecialFields.includes(innerKey)) {
            if (!object[innerKey]) {
              emptyFields.push(innerKey);
            }
          }
        })
      }
    }
  })
  if (emptyFields.length > 0) {
    return emptyFields;
  } else return true;
}

function validateField (value, type) {
  var valid;
  if (type === 'email') {
    valid = tools.checkEmail(value);
  } else if (type === 'cnpj') {
    valid = tools.checkCNPJ(value);
  } else if (type === 'cpf') {
    valid = tools.checkCpf(value);
  } else {
    valid = false;
  }
  return valid;
}