import tools from '/imports/startup/tools/index';

export default function validateInput (value, type) {
  if (!value) {
    return true;
  }
  switch (type) {
    case 'phone':
      return tools.checkPhone(value);
    case 'email':
      return tools.checkEmail(value);
    case 'cnpj':
      return tools.checkCNPJ(value);
    case 'cpf':
      return tools.checkCpf(value);
    default:
      return true;
  }
}