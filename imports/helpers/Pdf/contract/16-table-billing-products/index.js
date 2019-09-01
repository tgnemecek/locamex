import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableBillingProducts(props) {
  var billingProducts = props.billingProducts.charges.map((charge, i) => {
    var startDate = moment(props.billingProducts.startDate)
                    .add((i * 30 + (i * 1)), 'days');
    var endDate = moment(startDate).add(29, 'days');
    var expiryDate = moment(startDate)
                    .set('date', props.billingProducts.expiryDay);
    return {
      ...charge,
      startDate,
      endDate,
      expiryDate
    }
  })
  const body = () => {
    return billingProducts.map((charge, i, array) => {
      var index = (i + 1);
      var period = {text: moment(charge.startDate).format("DD/MM/YYYY") + ' a ' +  moment(charge.endDate).format("DD/MM/YYYY"), alignment: 'center'};
      var expiryDate = moment(charge.expiryDate).format("DD/MM/YYYY");
      var description = charge.description;
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