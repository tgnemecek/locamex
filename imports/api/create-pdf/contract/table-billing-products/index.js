import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableBillingProducts(billingProducts, totalValueProducts, resultFormat, styles) {
  const renderBody = () => {
    var header = [ ['#', {text: 'Período', alignment: 'center'}, 'Vencimento', 'Descrição da Cobrança', {text: 'Valor', alignment: 'right'}] ];
    var body = billingProducts.map((charge, i, array) => {

      var index = (i + 1);
      var period = {text: moment(charge.startDate).format("DD/MM/YYYY") + ' a ' +  moment(charge.endDate).format("DD/MM/YYYY"), alignment: 'center'};
      var endDate = moment(charge.endDate).format("DD/MM/YYYY");
      var description = charge.description;
      var value = {text: tools.format(charge.value, 'currency'), alignment: 'right'};
      return [index, period, endDate, description, value];
    });
    var footer = [ [{text: 'Valor Total da Locação:', colSpan: 4, alignment: 'right', bold: true}, '', '', '', resultFormat(totalValueProducts)] ];
    return header.concat(body, footer);
  }
  return {table: {
    headerRows: 1,
    widths: ['auto', 110, 'auto', '*', 50],
    heights: styles.cellheight,
    body: renderBody()
  }, style: 'table'}
}