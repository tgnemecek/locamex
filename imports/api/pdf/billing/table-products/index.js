import tools from '/imports/startup/tools/index';

export default function tableProducts(
  dates, products, discount, resultFormat, value, generateTable) {

  var timeUnitLabel = dates.timeUnit === "months" ? "Meses" : "Dias";

  var timeUnitValueLabel = dates.timeUnit === "months" ?
                        {text: 'Valor Mensal', alignment: 'left'} : null;

  const body = () => {
    const monthlyPrice = (price) => {
      if (dates.timeUnit === "months") {
        return {text: tools.format(price, 'currency'), alignment: 'right'}
      } else return null;
    }
    const duration = (duration) =>  {
      if (dates.timeUnit === "months") {
        return {text: duration.toString(), alignment: 'center'}
      } else return {text: "até 30", alignment: 'center'};
    }
    if (products) {
      return products.map((product, i) => {
        return [
          (i+1),
          product.description,
          tools.format(product.price, 'currency'),
          {text: product.quantity.toString(), alignment: 'center'},
          monthlyPrice(product.price * product.quantity)
        ];
      })
    } else return [{text: '', colSpan: 6}];
  }

  const footer = () => {
    const getDiscount = () => {
      if (discount) {
        return [
          {text: 'Desconto por tempo de Locação:', colSpan: 'fill', alignment: 'right', bold: true},
          {text: `-${discount * 100}%`, alignment: 'right', bold: true}
        ]
      } else return null
    }
    return [
      getDiscount(),
      [
        {text: 'Valor Total Desta Fatura:', colSpan: 'fill', alignment: 'right', bold: true}, resultFormat(value)
      ]
    ]
  }

  const widths = () => {
    if (dates.timeUnit === "months") {
      return ['auto', '*', 'auto', 'auto', 'auto'];
    } else return ['auto', '*', 'auto', 'auto', 'auto'];
  }

  return [
    {text: 'Itens Locados', style: 'h2', alignment: 'center'},
    generateTable({
      header: [
        [
        '#',
        'Descrição',
        {text: 'Valor Unit.', alignment: 'left'},
        {text: 'Qtd.', alignment: 'center'},
        timeUnitValueLabel
      ]
    ],
      body: body(),
      footer: footer(),
      widths: widths()
    })
  ]
}