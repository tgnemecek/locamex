import tools from '/imports/startup/tools/index';

export default function tableProducts(props) {
  const timeUnitLabel = () => {
    return props.dates.timeUnit === "months" ? "Meses" : "Dias";
  }
  var header = [ [
    '#',
    'Descrição',
    {text: 'Valor Unit.', alignment: 'left'},
    {text: 'Qtd.', alignment: 'center'},
    {text: 'Valor Mensal', alignment: 'left'},
    {text: timeUnitLabel(), alignment: 'center'},
    {text: 'Valor Total', alignment: 'right'}
  ] ];
  if (props.dates.timeUnit === "days") header[0].splice(4, 1);
  const body = () => {
    if (props.products) {
      return props.products.map((product, i) => {
        var arr = [
          (i+1),
          product.description,
          tools.format(product.price, 'currency'),
          {text: product.renting.toString(), alignment: 'center'},
          {text: tools.format((product.price * product.renting), 'currency'), alignment: 'center'},
          {text: props.dates.duration.toString(), alignment: 'center'},
          {text: tools.format(product.finalPrice, 'currency'), alignment: 'right'}
        ];
        if (props.dates.timeUnit === "days") arr.splice(4, 1);
      })
    } else return [[ {text: '', colSpan: 6}, '', '', '', '', '', '' ]];
  }
  const footer = () => {
    const monthlyValue = () => {
      if (props.dates.timeUnit === "months") {
        return
      }
    }
    if (props.discount) {
      var arr = [
        [ {text: 'Desconto por tempo de Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', {text: `-${props.discount * 100}%`, alignment: 'right', bold: true} ],
        [ {text: 'Valor Mensal de Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProrogation) ],
        [ {text: 'Valor Total da Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProducts) ]
      ]
      if (props.dates.timeUnit === "days") arr.splice(1, 1);
      return arr;
    } else {
      var arr = [
        [ {text: 'Valor Mensal de Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProrogation) ],
        [ {text: 'Valor Total da Locação:', colSpan: 6, alignment: 'right', bold: true}, '', '', '', '', '', props.resultFormat(props.totalValueProducts) ]
      ]
      if (props.dates.timeUnit === "days") arr.splice(0, 1);
      return arr;
    }
  }
  return {table: {
    headerRows: 1,
    widths: [ 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto' ],
    heights: props.styles.cellheight,
    body: header.concat(body(), footer())
  }, style: 'table'}
}