import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableBillingServices(billingServices, totalValueServices, inss, iss, resultFormat, styles) {
  const renderBody = () => {
    var header = [ ['#', 'Vencimento', 'Descrição da Cobrança', {text: 'INSS + ISS', alignment: 'center'}, {text: 'Valor Final', alignment: 'right'}] ];
    var body = billingServices.map((charge, i, array) => {

      var index = (i + 1);
      var endDate = moment(charge.endDate).format("DD/MM/YYYY");
      var description = charge.description;
      var taxes = {text: tools.format((charge.value * (inss + iss) / 100), 'currency'), alignment: 'center'};
      var value = {text: tools.format(charge.value, 'currency'), alignment: 'right'};
      return [index, endDate, description, taxes, value];
    });
    var footer = [ [{text: 'Valor Total do Pacote de Serviços:', colSpan: 4, alignment: 'right', bold: true}, '', '', '', resultFormat(totalValueServices)] ];
    return header.concat(body, footer);
  }
  return {table: {
    headerRows: 1,
    widths: ['auto', 'auto', '*', 50, 60],
    heights: styles.cellheight,
    body: renderBody()
  }, style: 'table'}
}