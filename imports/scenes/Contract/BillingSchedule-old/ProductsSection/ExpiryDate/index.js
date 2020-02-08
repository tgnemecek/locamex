import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import CalendarBar from '/imports/components/CalendarBar/index';

export default class ExpiryDate extends React.Component {
  onChange = (e) => {
    var firstExpiry = e.target.value;
    var billingProducts = this.props.billingProducts.map((charge, i) => {
      return {
        ...charge,
        expiryDate:  moment(firstExpiry).add((1 * i), 'months').toDate()
      }
    })

    this.props.updateBilling({
      billingProducts
    })
  }
  render() {
    return (
      <CalendarBar
        title="Primeiro Vencimento:"
        disabled={this.props.disabled}
        value={this.props.billingProducts[0].expiryDate}
        onChange={this.onChange}/>
    )
  }
}