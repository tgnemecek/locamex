import tools from '/imports/startup/tools/index';
import moment from 'moment';

export default function tableBillingServices(props) {
  var accountBaseText = ` - Informamos: Pagamentos de Notas Fiscais Eletrônicas (NFe) são exclusivos através de Depósito Bancário junto ao Banco ${props.accountServices.bank} (${props.accountServices.bankNumber}) Agência ${props.accountServices.branch} C/C ${props.accountServices.account} a favor da LOCADORA.`

  const body = () => {
    return props.billingServices.map((charge, i, array) => {
      var index = (i + 1);
      var expiryDate = moment(charge.expiryDate).format("DD/MM/YYYY");
      var description = charge.description + accountBaseText;
      var taxes = {text: tools.format((charge.value * (charge.inss + charge.iss) / 100), 'currency'), alignment: 'center'};
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