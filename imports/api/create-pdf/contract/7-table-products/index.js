import tools from '/imports/startup/tools/index';

export default function tableProducts(props) {

  const timeUnitLabel = () => {
    return props.dates.timeUnit === "months" ? "Meses" : "Dias";
  }

  const timeUnitValueLabel = () => {
    return props.dates.timeUnit === "months" ? {text: 'Valor Mensal', alignment: 'left'} : null;
  }

  const body = () => {
    const monthlyPrice = (price) => {
      if (props.dates.timeUnit === "months") {
        return {text: tools.format(price, 'currency'), alignment: 'center'}
      } else return null;
    }
    if (props.products) {
      return props.products.map((product, i) => {
        return [
          (i+1),
          product.description,
          tools.format(product.price, 'currency'),
          {text: product.renting.toString(), alignment: 'center'},
          monthlyPrice(product.price * product.renting),
          {text: props.dates.duration.toString(), alignment: 'center'},
          {text: tools.format(product.finalPrice, 'currency'), alignment: 'right'}
        ];
      })
    } else return {text: '', colSpan: 6};
  }

  const footer = () => {
    var colSpan = props.dates.timeUnit === "months" ? 6 : 5;
    const monthlyValue = () => {
      if (props.dates.timeUnit === "months") {
        return [
          {text: 'Valor Mensal de Locação:', colSpan: 6, alignment: 'right', bold: true}, props.resultFormat(props.totalValueProrogation)
        ]
      } else return null
    }
    const discount = () => {
      if (props.discount) {
        return [
          {text: 'Desconto por tempo de Locação:', colSpan, alignment: 'right', bold: true},
          {text: `-${props.discount * 100}%`, alignment: 'right', bold: true}
        ]
      } else return null
    }
    return [
      discount(),
      monthlyValue(),
      [ {text: 'Valor Total da Locação:', colSpan, alignment: 'right', bold: true}, props.resultFormat(props.totalValueProducts) ]
    ]
  }

  const widths = () => {
    if (props.dates.timeUnit === "months") {
      return ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'];
    } else return ['auto', '*', 'auto', 'auto', 'auto', 'auto'];
  }

  return props.generateTable({
    header: [[
      '#',
      'Descrição',
      {text: 'Valor Unit.', alignment: 'left'},
      {text: 'Qtd.', alignment: 'center'},
      timeUnitValueLabel(),
      {text: timeUnitLabel(), alignment: 'center'},
      {text: 'Valor Total', alignment: 'right'}
    ]],
    body: body(),
    footer: footer(),
    widths: widths(),
    styles: props.styles
  })
}