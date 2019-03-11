import tools from '/imports/startup/tools/index';

export default function tableProducts(products, dates, discount, totalValueProrogation, totalValueProducts, resultFormat, styles) {
  const header = [ [
    '#',
    'Descrição',
    {text: 'Valor Unit.', alignment: 'left'},
    {text: 'Qtd.', alignment: 'center'},
    {text: 'Valor Mensal', alignment: 'left'},
    {text: 'Meses', alignment: 'center'},
    {text: 'Valor Total', alignment: 'right'}
  ] ];
  const body = () => {
    if (products) {
      return products.map((product, i) => {
        return [
          (i+1),
          product.description,
          tools.format(product.price, 'currency'),
          {text: product.quantity.toString(), alignment: 'center'},
          {text: tools.format((product.price * product.quantity), 'currency'), alignment: 'center'},
          {text: dates.duration.toString(), alignment: 'center'},
          {text: tools.format(product.finalPrice, 'currency'), alignment: 'right'}
        ];
      })
    } else return [[ {text: '', colSpan: 6}, '', '', '', '', '', '' ]];
  }
  const footer = () => {
    // return [[{text: '', colSpan: 2}, '', '', '', '', '', '']];
    if (discount) {
      return [
        [ {text: 'Desconto por tempo de Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', {text: `-${discount * 100}%`, alignment: 'right', bold: true} ],
        [ {text: 'Valor Mensal de Prorrogação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', resultFormat(totalValueProrogation) ],
        [ {text: 'Valor Total da Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', resultFormat(totalValueProducts) ]
      ]
    } else {
      return [
        [ {text: 'Valor Mensal de Prorrogação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', resultFormat(totalValueProrogation) ],
        [ {text: 'Valor Total da Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', resultFormat(totalValueProducts) ]
      ]
    }
  }
  return {table: {
    headerRows: 1,
    widths: [ 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto' ],
    heights: styles.cellheight,
    body: header.concat(body(), footer())
  }, style: 'table'}
}