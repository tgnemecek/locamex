import React from 'react';

import tools from '/imports/startup/tools/index';

import ShippingFixed from './ShippingFixed/index';
import ShippingAccessories from './ShippingAccessories/index';
import Observations from './Observations/index';
import SelectMultiple from './SelectMultiple/index';

export default class ShippingBody extends React.Component {
  sortSeriesDatabase = () => {
    var seriesDatabase = tools.deepCopy(this.props.seriesDatabase);
    return seriesDatabase.sort((a, b) => {
      var comparison = a.place.localeCompare(b.place);
      if (comparison === 0) {
        return a.serial.toString().localeCompare(b.serial.toString());
      } else return comparison;
    })
  }

  render() {
    return (
      <div>
        <ShippingFixed {...this.props} Observations={Observations} seriesDatabase={this.sortSeriesDatabase()}/>
        <ShippingAccessories {...this.props} Observations={Observations} SelectMultiple={SelectMultiple} />
      </div>
    )
  }
}