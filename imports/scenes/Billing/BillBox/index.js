import React  from 'react';
import moment from 'moment';

import Box from '/imports/components/Box/index';

import ProductsBox from './ProductsBox/index';
import ServicesBox from './ServicesBox/index';

export default function BillBox(props) {

  var SelectedBox = props.charge.type === "billingServices" ? ServicesBox : ProductsBox;

  const getFormattedDate = (which) => {
    var start = moment(props.charge.startDate).format("DD/MM/YYYY");
    var end = moment(props.charge.endDate).format("DD/MM/YYYY");
    var expiry = moment(props.charge.expiryDate).format("DD/MM/YYYY");

    if (which === "period") {
      return start + " a " + end;
    } else return expiry;
  }

  return (
    <Box
      className="billing__bill-box"
      closeBox={props.toggleWindow}
      title="Visualizador de Cobrança">
        <SelectedBox
          {...props}
          getFormattedDate={getFormattedDate}/>
    </Box>
  )
}