import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableBillingProducts(props) {
  var accountBaseText = ` - Informamos: Locações são cobradas através de Faturas de Locação de Bens Móveis plenamente contabilizáveis.`
  const body = () => {
    return props.billingProducts.map((charge, i, array) => {
      var index = (i + 1);
      var period = {text: moment(charge.startDate).format("DD/MM/YYYY") + ' a ' +  moment(charge.endDate).format("DD/MM/YYYY"), alignment: 'center'};
      var expiryDate = moment(charge.expiryDate).format("DD/MM/YYYY");
      var description = charge.description + accountBaseText;
      var value = {text: tools.format(charge.value, 'currency'), alignment: 'right'};
      return [index, period, expiryDate, description, value];
    });
  }
  return props.generateTable({
    header: [[
      '#',
      {text: 'Período', alignment: 'center'},
      'Vencimento',
      'Descrição da Cobrança',
      {text: 'Valor', alignment: 'right'}
    ]],
    body: body(),
    footer: [[
      {text: 'Valor Total da Locação:', colSpan: 4, alignment: 'right', bold: true},
      props.resultFormat(props.totalValueProducts)
    ]],
    widths: ['auto', 110, 'auto', '*', 60],
    styles: props.styles
  })
}