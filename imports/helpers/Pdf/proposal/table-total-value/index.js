import tools from '/imports/startup/tools/index';

export default function tableTotalValue(props) {

  var totalValue = props.totalValueProducts + props.totalValueServices;

  return [
    {text: 'Valor Total do Orçamento', style: 'h2', alignment: 'center'},
    props.generateTable({
      body: [
        [{text: 'Valor Total da Locação:', alignment: 'right', bold: true}, props.resultFormat(props.totalValueProducts)],
        [{text: 'Valor Total do Pacote de Serviços:', alignment: 'right', bold: true}, props.resultFormat(props.totalValueServices)],
        [{text: 'Valor Total do Orçamento:', alignment: 'right', bold: true}, {text: props.resultFormat(totalValue), fillColor: 'yellow'}]
      ],
      widths: [ '*', 60 ],
      styles: props.styles
    })
  ]
}