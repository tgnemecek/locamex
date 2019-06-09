import tools from '/imports/startup/tools/index';

export default function checkRequiredFields (state) {

  function checkCompany(state) {
    var invalidFields = [];

    Object.keys(state).forEach((key) => {
      switch (key) {
        case "description":
        case "type":
        case "registry":
        case "officialName":
        case "registryMU":
        case "registryES":
          if (!validateField(state[key], key)) {
            invalidFields.push(key);
          }
          break;
        case "address":
          invalidFields = invalidFields.concat(checkAddress(state[key]));
          break;
      }
    })
    // Conditional validation: only one is necessary
    var muIndex = invalidFields.findIndex((field) => field === "registryMU");
    var esIndex = invalidFields.findIndex((field) => field === "registryES");
    if (muIndex > -1 && esIndex === -1) {
      invalidFields.splice(muIndex, 1);
    } else if (esIndex > -1 && muIndex === -1) {
      invalidFields.splice(esIndex, 1);
    }
    if (invalidFields.length > 0) {
      return invalidFields;
    } else return true;
  }
  function checkPerson(state) {
    var invalidFields = [];

    Object.keys(state).forEach((key) => {
      switch (key) {
        case "description":
        case "type":
        case "registry":
        case "rg":
        case "phone1":
        case "email":
          if (!validateField(state[key], key)) {
            invalidFields.push(key);
          }
          break;
        case "address":
          invalidFields = invalidFields.concat(checkAddress(state[key]));
          break;
      }
    })
    if (invalidFields.length > 0) {
      return invalidFields;
    } else return true;
  }
  function checkAddress(address) {
    return Object.keys(address).filter((key) => {
      return !address[key];
    });
  }
  function validateField (value, type) {
    if (!value) return false;

    var valid;
    if (type === 'email') {
      valid = tools.checkEmail(value);
    } else if (type === 'registry') {
      var isCNPJ = tools.checkCNPJ(value);
      var isCPF = tools.checkCpf(value);
      if  (isCNPJ || isCPF) {
        valid = true
      } else valid = false;
    } else if (type === 'phone1') {
      valid = tools.checkPhone(value);
    } else {
      valid = true;
    }
    return valid;
  }



  // Main:
  if (state.type === "company") {
    return checkCompany(state);
  } else return checkPerson(state);
}

