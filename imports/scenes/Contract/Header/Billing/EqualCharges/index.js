import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';

export default function EqualCharges (props) {

  onClick = () => {
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

    var charges = setEqualValues(props.charges);
    props.updateBilling(props.stateKey, charges);
  }

  return <button onClick={onClick} className="button--pill billing__equal-charges">Divisão Exata</button>

}