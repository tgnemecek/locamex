import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Text extends React.Component {
  onChange = (e) => {
    if (e) {
      var value = e.target.value;
      this.props.onChange(value);
    }
  }
  render() {
    return (
      <input
        value={this.props.value}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        onClick={this.props.buttonClick}

        style={this.props.style}
        />
    )
  }
}