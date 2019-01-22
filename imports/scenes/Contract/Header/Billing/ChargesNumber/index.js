import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';

// This has to be a class because we are using it more than once, requring different instances
export default class ChargesNumber extends React.Component {
  onChange = (e) => {
    var value = Number(e.target.value);
    var charges = tools.deepCopy(this.props.charges);
    var newCharges = [];
    var difference = Math.abs(charges.length - value);

    const updateChargesInformation = (charges) => {
      return charges.map((charge, i) => {
        var startDate = charges[0] ? charges[0].startDate : new Date();
        return {
          ...charge,
          startDate: moment(startDate).add((30 * i + i), 'days').toDate(),
          endDate: moment(startDate).add((30 * i + 30 + i), 'days').toDate(),
          description: `Parcela ${i + 1} de ${value} ${this.props.description}`
        }
      })
    }
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
    if (value > charges.length) {
      for (var i = 0; i < difference; i++) {
        newCharges.push({});
      }
      charges = charges.concat(newCharges);
      charges = setEqualValues(charges);
    } else if (value < charges.length) {
      for (var i = 0; i < value; i++) {
        newCharges.push(charges[i]);
      }
      charges = setEqualValues(newCharges);
    }
    charges = updateChargesInformation(charges);
    this.props.updateBilling(this.props.stateKey, charges);
  }
  render() {
    return (
      <Input
        title="Número de Cobranças:"
        type="number"
        value={this.props.charges.length}
        onChange={this.onChange}/>
    )
  }
}