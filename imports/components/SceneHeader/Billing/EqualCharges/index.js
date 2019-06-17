import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';

// This has to be a class because we are using it more than once, requring different instances
export default class EqualCharges extends React.Component {
  onClick = () => {
    const setEqualValues = (charges) => {
      var totalValue = this.props.masterValue;
      var equalValue = tools.round(totalValue / charges.length, 2);
      var rest = tools.round(totalValue - (equalValue * charges.length), 2);
      return charges.map((charge, i) => {
        if (i == 0) {
          charge.value = (equalValue + rest);
        } else charge.value = equalValue;
        return charge;
      })
    }

    var charges = setEqualValues(this.props.charges);
    this.props.updateBilling(this.props.stateKey, charges);
  }
  render() {
    return <button onClick={this.onClick} className="button--pill billing__equal-charges">Divisão Exata</button>
  }
}