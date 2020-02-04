import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Percent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: 0
    }
  }

  componentDidMount() {
    this.setDisplayValue(this.props.value);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      this.setDisplayValue(this.props.value);
    }
  }

  getDisplayValue = (displayValue) => {
    function clamp(value) {
      value = Number(value);

      if (value > 100) return 100;
      if (value < 0) return 0;
      return value;
    }
    displayValue = tools.format(displayValue, 'number');
    return clamp(displayValue);
  }

  setDisplayValue = (displayValue) => {
    var displayValue = this.getDisplayValue(displayValue);
    displayValue = Math.round(displayValue * 100);
    this.setState({
      displayValue: displayValue.toString()
    });
  }

  onChange = (e) => {
    e.preventDefault();
    var displayValue = this.getDisplayValue(e.target.value);
    var exportValue = displayValue / 100;
    this.props.onChange(exportValue);
  }

  render() {
    return (
      <input
        type="number"
        value={this.state.displayValue}
        onChange={this.onChange}

        min={0}
        max={100}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}