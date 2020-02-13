import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Digits extends React.Component {
  formatValue = (value) => {
    return value.replace(/\D+/g, '');
  }

  onChange = (e) => {
    e.preventDefault();
    this.props.onChange(this.formatValue(e.target.value));
  }

  render() {
    return (
      <input
        value={this.formatValue(this.props.value)}
        type="text"
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}