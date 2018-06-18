import { Meteor } from 'meteor/meteor';

export default class customTypes {

  static format = (value, type) => {

    let reais = {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL'
    }

    if (value) {
      value = value.toString();
      switch (type) {
        case 'number':
          return Number(value.replace(/\D+/g, ''));
          break;
        case 'phone':
          value = value.replace(/\D+/g, '');
          if (value.length > 0) {
            value = value.substring(0, 0) + "(" + value.substring(0);
          }
          if (value.length > 3) {
            value = value.substring(0, 3) + ") " + value.substring(3);
          }
          if (value.length > 9) {
            value = value.substring(0, 9) + "-" + value.substring(9);
          }
          if (value.length > 14) {
            value = value.substring(0, 15);
          }
          break;
        case 'cnpj':
          value = value.replace(/\D+/g, '');
          if (value.length > 2) {
            value = value.substring(0, 2) + "." + value.substring(2);
          }
          if (value.length > 6) {
            value = value.substring(0, 6) + "." + value.substring(6);
          }
          if (value.length > 10) {
            value = value.substring(0, 10) + "/" + value.substring(10);
          }
          if (value.length > 15) {
            value = value.substring(0, 15) + "-" + value.substring(15);
          }
          if (value.length > 17) {
            value = value.substring(0, 18);
          }
          break;
        case 'cpf':
          value = value.replace(/\D+/g, '');
          if (value.length > 3) {
            value = value.substring(0, 3) + "." + value.substring(3);
          }
          if (value.length > 7) {
            value = value.substring(0, 7) + "." + value.substring(7);
          }
          if (value.length > 11) {
            value = value.substring(0, 11) + "-" + value.substring(11);
          }
          if (value.length > 13) {
            value = value.substring(0, 14);
          }
          break;
        case 'reaisPrefix':
          value = Number(value);
          return value.toLocaleString('pt-br', reais);
          break;
        case 'reais':
          value = Number(value);
          return parseFloat(Math.round(value * 100) / 100).toFixed(2);
          break;
        default:
          value = value;
      }
      return value;
    }
    return null;
  }

  static getRef = (object, i) => {
    //This is used to get a specific Ref when there's more than one DOM element associated to a single Ref
    //If i is undefined, it returns the whole array or the first element if the array has length == 1
    if (typeof(object) !== 'object') {throw new Meteor.Error('wrong-type', 'First argument must be an Object');}
    var values = Object.values(object);
    if (i == undefined) {
      return values.length == 1 ? values[0] : values;
    }
    if (typeof(i) !== 'number') {throw new Meteor.Error('wrong-type', 'Second argument must be a number');}
    return values[i];
  }

  static checkPhone (arg) {
    if (arg === undefined) {return false}
    arg = arg.toString().replace(/\D+/g, '');

    if (arg.length > 9) {
      return true;
    }
    return false;
  }

  static checkCPF(arg) {
      var Soma = 0;
      var Resto;

      arg = arg.toString();

      if (arg == "00000000000") return false;

      for (var i=1; i<=9; i++) Soma = Soma + parseInt(arg.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(arg.substring(9, 10)) ) return false;

      Soma = 0;
      for (i = 1; i <= 10; i++) Soma = Soma + parseInt(arg.substring(i-1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(arg.substring(10, 11) ) ) return false;
      return true;
  }

  static checkCNPJ (arg) {
    arg = arg.replace(/[^\d]+/g,'');
    if(arg == '') return false;
    if (arg.length != 14)
        return false;
    // Elimina CNPJs invalidos conhecidos
    if (arg == "00000000000000" ||
        arg == "11111111111111" ||
        arg == "22222222222222" ||
        arg == "33333333333333" ||
        arg == "44444444444444" ||
        arg == "55555555555555" ||
        arg == "66666666666666" ||
        arg == "77777777777777" ||
        arg == "88888888888888" ||
        arg == "99999999999999") {
          return false;
        }
    // Valida DVs
    var tamanho = arg.length - 2;
    var numeros = arg.substring(0,tamanho);
    var digitos = arg.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;

    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }

    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

    if (resultado != digitos.charAt(0))
        return false;
    tamanho = tamanho + 1;
    numeros = arg.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
    return true;
  }

  static checkEmail(arg) {
    // var re = /\S+@\S+/;
    var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return re.test(arg);
  }
}