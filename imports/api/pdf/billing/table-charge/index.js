import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function tableCharge(props) {

  var start = moment(props.charge.startDate).format("DD/MM/YYYY");
  var end = moment(props.charge.endDate).format("DD/MM/YYYY");
  var expiry = moment(props.charge.expiryDate).format("DD/MM/YYYY");
  var period = start + " a " + end;

  var contractNumber = props._id + "." + props.activeVersion;

  return props.generateTable({
    body: [
      [ 'Vencimento', expiry, 'Valor Total da Fatura', tools.format(props.charge.value, 'currency') ],
      [ 'Período de Locação', period, 'Contrato', contractNumber ]
    ],
    widths: ['*', '*', '*', '*']
  })
}