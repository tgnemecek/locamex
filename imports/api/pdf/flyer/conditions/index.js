import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default function conditions (props) {
  return {text: [
    `Condições de Pagamento: Boleto Bancário a vencer dia ${moment(props.charge.expiryDate).format("DD/MM/YYYY")} no valor de ${tools.format(props.charge.value, "currency")}`
  ], style: 'p'}
}