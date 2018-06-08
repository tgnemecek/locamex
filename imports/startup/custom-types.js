import { Meteor } from 'meteor/meteor';

export default class customTypes {
  static formatReais = (n, prefix) => {

    let format = {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL'
    }

    n = Number(n);

    if (prefix) {
      return n.toLocaleString('pt-br', format);
    } else {
      return parseFloat(Math.round(n * 100) / 100).toFixed(2);
    }
  }
  //This is used to get a specific Ref when there's more than one DOM element associated to a single Ref
  //If i is undefined, it returns the whole array or the first element if the array has length == 1
  static getRef = (object, i) => {

    if (typeof(object) !== 'object') {throw new Meteor.Error('wrong-type', 'First argument must be an Object');}

    var values = Object.values(object);

    if (i == undefined) {
      return values.length == 1 ? values[0] : values;
    }

    if (typeof(i) !== 'number') {throw new Meteor.Error('wrong-type', 'Second argument must be a number');}

    return values[i];

  }
}