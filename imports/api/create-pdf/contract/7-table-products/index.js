import tools from '/imports/startup/tools/index';

export default function tableProducts(props) {
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
    if (props.products) {
      return props.products.map((product, i) => {
        return [
          (i+1),
          product.description,
          tools.format(product.price, 'currency'),
          {text: product.renting.toString(), alignment: 'center'},
          {text: tools.format((product.price * product.renting), 'currency'), alignment: 'center'},
          {text: props.dates.duration.toString(), alignment: 'center'},
          {text: tools.format(product.finalPrice, 'currency'), alignment: 'right'}
        ];
      })
    } else return [[ {text: '', colSpan: 6}, '', '', '', '', '', '' ]];
  }
  const footer = () => {
    // return [[{text: '', colSpan: 2}, '', '', '', '', '', '']];
    if (props.discount) {
      return [
        [ {text: 'Desconto por tempo de Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', {text: `-${props.discount * 100}%`, alignment: 'right', bold: true} ],
        [ {text: 'Valor Mensal de Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProrogation) ],
        [ {text: 'Valor Total da Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProducts) ]
      ]
    } else {
      return [
        [ {text: 'Valor Mensal de Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProrogation) ],
        [ {text: 'Valor Total da Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProducts) ]
      ]
    }
  }
  return {table: {
    headerRows: 1,
    widths: [ 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto' ],
    heights: props.styles.cellheight,
    body: header.concat(body(), footer())
  }, style: 'table'}
}