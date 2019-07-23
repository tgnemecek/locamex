import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableBillingServices(props) {
  const body = () => {
    return props.billingServices.map((charge, i, array) => {
      var index = (i + 1);
      var expiryDate = moment(charge.expiryDate).format("DD/MM/YYYY");
      var description = charge.description;
      var taxes = {text: tools.format((charge.value * (props.inss + props.iss) / 100), 'currency'), alignment: 'center'};
      var value = {text: tools.format(charge.value, 'currency'), alignment: 'right'};
      return [index, expiryDate, description, taxes, value];
    });
  }
  return props.generateTable({
    header: [[
      '#',
      'Vencimento',
      'Descrição da Cobrança',
      {text: 'INSS + ISS', alignment: 'center'},
      {text: 'Valor Final', alignment: 'right'}
    ]],
    body: body(),
    footer: [[
      {text: 'Valor Total do Pacote de Serviços:', colSpan: 4, alignment: 'right', bold: true}, props.resultFormat(props.totalValueServices)
    ]],
    widths: ['auto', 'auto', '*', 50, 60],
    styles: props.styles
  })
}