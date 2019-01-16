import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';

export default function ChargesNumber (props) {

  onChange = (e) => {
    var value = Number(e.target.value);
    var charges = tools.deepCopy(props.charges);
    var newCharges = [];
    var difference = Math.abs(charges.length - value);

    function updateChargesDates (charges) {
      return charges.map((charge, i) => {
        var startDate = charges[0] ? charges[0].startDate : new Date();
        return {
          ...charge,
          startDate: moment(startDate).add((30 * i + i), 'days').toDate(),
          endDate: moment(startDate).add((30 * i + 30 + i), 'days').toDate(),
        }
      })
    }
    const setEqualValues = (charges) => {
      var totalValue = props.masterValue;
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
        var chargeValue = props.charges[0] ? props.charges[0].value : '';
        newCharges.push({
          description: `Parcela ${i +  charges.length + 1} de ${charges.length+1} ${props.description}`
        })
      }
      charges = charges.concat(newCharges);
      charges = setEqualValues(charges);
    } else if (value < charges.length) {
      for (var i = 0; i < value; i++) {
        newCharges.push(charges[i]);
      }
      charges = setEqualValues(newCharges);
    }
    charges = updateChargesDates(charges);
    props.updateBilling(props.stateKey, charges);
  }

  return (
    <Input
      title="Número de Cobranças:"
      type="number"
      value={props.charges.length}
      onChange={onChange}/>
  )
}