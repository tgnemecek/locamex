import React from 'react';
import { Meteor } from 'meteor/meteor';
import CurrencyInput from 'react-currency-input';

export default class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maskedValue: 'R$ 0,00'
    }
  }
  onChangeEvent = (e, maskedValue, floatValue) => {
    this.props.onChange(floatValue);
    this.setState({ maskedValue })
  }
  render() {
    return (
      <CurrencyInput
        value={this.state.maskedValue}
        onChangeEvent={this.onChangeEvent}
        prefix="R$ "
        decimalSeparator=","
        thousandSeparator="."
        allowNegative={this.props.allowNegative}
        selectAllOnFocus={true}
      />
    )
  }
}