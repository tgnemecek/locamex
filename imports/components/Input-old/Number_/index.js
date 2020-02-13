import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Number_ extends React.Component {
  onChange = (e) => {
    if (e) {
      var value = this.minMax(e.target.value);
      this.props.onChange(Number(value));
    }
  }
  minMax = (value) => {
    if (!value) value = 0;
    value = Number(value);
    value = value < this.props.min ? this.props.min : value;
    value = value > this.props.max ? this.props.max : value;
    return value;
  }
  render() {
    return (
      <input
        value={this.minMax(this.props.value)}
        onChange={this.onChange}
        type="number"

        min={this.props.min}
        max={this.props.max}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        onClick={this.props.buttonClick}

        style={this.props.style}
        />
    )
  }
}