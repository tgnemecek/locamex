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

    if (!this.props.disabled) {
      var charges = setEqualValues(this.props.charges);
      this.props.updateBilling(charges);
    }
  }
  className = () => {
    var className = "button--pill billing-schedule__equal-charges";
    if (this.props.disabled) {
      className += " disable-click"
    }
    return className;
  }
  render() {
    return (
      <div>
        <button
          onClick={this.onClick}
          disabled={this.props.disabled}
          className={this.className()}>
          Divisão Exata
        </button>
      </div>
    )
  }
}