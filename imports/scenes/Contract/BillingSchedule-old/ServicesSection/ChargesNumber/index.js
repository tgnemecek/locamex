import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';

export default class ChargesNumber extends React.Component {
  onChange = (e) => {
    this.props.setCharges(Number(e.target.value));
  }
  render() {
    return (
      <Input
        title="Número de Cobranças:"
        type="number"
        min={1}
        disabled={this.props.disabled}
        value={this.props.billingServices.length}
        onChange={this.onChange}/>
    )
  }
}