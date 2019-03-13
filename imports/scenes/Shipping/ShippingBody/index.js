import React from 'react';

import ShippingFixed from './ShippingFixed/index';
import ShippingAccessories from './ShippingAccessories/index';

export default class ShippingBody extends React.Component {
  render() {
    return (
      <div>
        <ShippingFixed {...this.props} />
        <ShippingAccessories {...this.props} />
      </div>
    )
  }
}