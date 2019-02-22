import React from 'react';

import ShippingFixed from './ShippingFixed/index';
import ShippingAccessories from './ShippingAccessories/index';

export default class ShippingBody extends React.Component {
  renderBody = () => {
    return this.props.products.map((product, i) => {

      var typeCount = 0;

      if (i > 0) {
        if (product.type !== this.props.products[i-1].type) {
          typeCount = 0;
        } else typeCount++;
      }

      switch (product.type) {
        case 'fixed':
          return <ShippingFixed {...product} key={i} index={typeCount} />
        break;
        case 'modular':
          return <ShippingFixed {...product} key={i} index={typeCount} />
        break;
        case 'accessory':
          return <ShippingAccessories {...product} key={i} index={typeCount} />
        break;
        case 'pack':
          return <ShippingFixed {...product} key={i} index={typeCount} />
        break;
        default:
          throw new Error('type-unknown-check-shipping-body');
      }
      return <div key={i}>{product.description}</div>
    })
  }

  render() {
    return (
      <div>
        <table className="table">
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
      </div>
    )
  }
}