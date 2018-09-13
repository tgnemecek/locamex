import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Currency extends React.Component {
  onChange = (e) => {
    if (e) {
      var inputValue = e.target.value;
      var exportValue;
      var displayValue = tools.format(cleanCurrency(inputValue), 'currency');
      exportValue = cleanCurrency(inputValue);

      this.props.onChange(exportValue);

      function cleanCurrency(inputValue) {
        inputValue = inputValue.replace(/\D+/g, '');
        return Number(inputValue) / 100;
      }
    }
  }
  render() {
    return (
      <input
        value={tools.format(this.props.value, "currency")}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}