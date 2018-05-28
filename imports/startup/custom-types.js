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
}