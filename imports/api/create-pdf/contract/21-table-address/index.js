import tools from '/imports/startup/tools/index';

export default function tableAddress(props) {
  var additional = props.deliveryAddress.additional ? ` (${props.deliveryAddress.additional})` : '';
  return props.generateTable({
    body: [
      `${props.deliveryAddress.street}, ${props.deliveryAddress.number}${additional} - ${props.deliveryAddress.city}, ${props.deliveryAddress.state} - ${tools.format(props.deliveryAddress.cep, 'cep')}` ],
    widths: ['*'],
    styles: props.styles
  })
}