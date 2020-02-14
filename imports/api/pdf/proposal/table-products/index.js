import tools from '/imports/startup/tools/index';

export default function tableProducts(props) {

  const timeUnitLabel = () => {
    return props.dates.timeUnit === "months" ? {text: 'Meses', alignment: 'center'} : {text: 'Dias', alignment: 'center'};
  }

  const timeUnitValueLabel = () => {
    return props.dates.timeUnit === "months" ? {text: 'Valor Mensal', alignment: 'right'} : null;
  }

  const body = () => {
    const monthlyPrice = (price) => {
      if (props.dates.timeUnit === "months") {
        return {text: tools.format(price, 'currency'), alignment: 'right'}
      } else return null;
    }
    const duration = (duration) =>  {
      if (props.dates.timeUnit === "months") {
        return {text: duration.toString(), alignment: 'center'}
      } else return {text: "até 30", alignment: 'right'};
    }
    if (props.products) {
      return props.products.map((product, i) => {
        return [
          (i+1),
          product.description,
          {text: tools.format(product.price, 'currency'), alignment: 'right'},
          {text: product.quantity.toString(), alignment: 'center'},
          monthlyPrice(product.price * product.quantity),
          duration(props.dates.duration),
          {text: tools.format(product.finalPrice, 'currency'), alignment: 'right'}
        ];
      })
    } else return [{text: '', colSpan: 'fill'}];
  }

  const footer = () => {
    const monthlyValue = () => {
      if (props.dates.timeUnit === "months") {
        return [
          {text: 'Valor Mensal de Locação:', colSpan: 'fill', alignment: 'right', bold: true}, props.resultFormat(props.totalValueProrogation)
        ]
      } else return null
    }
    const discount = () => {
      if (props.discount) {
        return [
          {text: 'Desconto por tempo de Locação:', colSpan: 'fill', alignment: 'right', bold: true},
          {text: `-${props.discount * 100}%`, alignment: 'right', bold: true}
        ]
      } else return null
    }
    return [
      discount(),
      monthlyValue(),
      [{text: 'Valor Total da Locação:', colSpan: 'fill', alignment: 'right', bold: true}, props.resultFormat(props.totalValueProducts)]
    ]
  }

  const widths = () => {
    if (props.dates.timeUnit === "months") {
      return ['auto', '*', 60, 'auto', 60, 'auto', 60];
    } else return ['auto', '*', 60, 'auto', 'auto', 60];
  }
debugger;
  return [
    {text: 'Itens a Serem Locados', style: 'h2', alignment: 'center'},
    props.generateTable({
      header: [[
        '#',
        'Descrição',
        {text: 'Valor Unit.', alignment: 'right'},
        {text: 'Qtd.', alignment: 'right'},
        timeUnitValueLabel(),
        {text: timeUnitLabel(), alignment: 'right'},
        {text: 'Valor Total', alignment: 'right'}
      ]],
      body: body(),
      footer: footer(),
      widths: widths(),
      styles: props.styles
    })
  ]
}