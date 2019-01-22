import tools from '/imports/startup/tools/index';

export default function tableAddress(deliveryAddress, styles) {
  var additional = deliveryAddress.additional ? ` (${deliveryAddress.additional})` : '';
  return {table: {
    widths: ['*'],
    heights: styles.cellheight,
    body: [
        [ `${deliveryAddress.street}, ${deliveryAddress.number}${additional} - ${deliveryAddress.city}, ${deliveryAddress.state} - ${tools.format(deliveryAddress.cep, 'cep')}` ]
      ]
  }, style: 'table'}
}