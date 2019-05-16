import tools from '/imports/startup/tools/index';

export default function tableAddress(props) {
  var additional = props.deliveryAddress.additional ? ` (${props.deliveryAddress.additional})` : '';
  return {table: {
    widths: ['*'],
    heights: props.styles.cellheight,
    body: [
        [ `${props.deliveryAddress.street}, ${props.deliveryAddress.number}${additional} - ${props.deliveryAddress.city}, ${props.deliveryAddress.state} - ${tools.format(props.deliveryAddress.cep, 'cep')}` ]
      ]
  }, style: 'table'}
}