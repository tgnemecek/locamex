import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function conditions (expiryDate, value) {
  return {text: [
    `Condições de Pagamento: Boleto Bancário a vencer dia ${moment(expiryDate).format("DD/MM/YYYY")} no valor de ${tools.format(value, "currency")}`
  ], style: 'p'}
}