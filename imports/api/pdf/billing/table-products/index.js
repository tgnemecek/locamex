import tools from '/imports/startup/tools/index';

export default function tableProducts(props) {

  var timeUnitLabel = props.dates.timeUnit === "months" ? "Meses" : "Dias";

  var timeUnitValueLabel = props.dates.timeUnit === "months" ?
                        {text: 'Valor Mensal', alignment: 'left'} : null;

  const body = () => {
    const monthlyPrice = (price) => {
      if (props.dates.timeUnit === "months") {
        return {text: tools.format(price, 'currency'), alignment: 'center'}
      } else return null;
    }
    const duration = (duration) =>  {
      if (props.dates.timeUnit === "months") {
        return {text: duration.toString(), alignment: 'center'}
      } else return {text: "até 30", alignment: 'center'};
    }
    if (props.products) {
      return props.products.map((product, i) => {
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
      [
        {text: 'Valor Total Desta Fatura:', colSpan: 'fill', alignment: 'right', bold: true}, props.resultFormat(props.charge.value)
      ]
    ]
  }

  const widths = () => {
    if (props.dates.timeUnit === "months") {
      return ['auto', '*', 'auto', 'auto', 'auto'];
    } else return ['auto', '*', 'auto', 'auto', 'auto'];
  }

  return [
    {text: 'Itens Locados', style: 'h2', alignment: 'center'},
    props.generateTable({
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