import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Digits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: ''
    }
  }
  componentDidMount() {
    this.calculateValues(this.props.value.toString().replace('.', ','));
  }
  componentDidUpdate(prevProps, prevState) {
    var value = this.props.value;
    if (prevProps.value !== value
        && this.state.displayValue !== "-"
        && this.state.displayValue !== "") {
      value = value.toString().replace('.', ',');
      this.calculateValues(value);
    }
  }
  onChange = (e) => {
    var displayValue = e.target.value.trim();
    this.calculateValues(displayValue);
  }
  calculateValues = (displayValue) => {
    var options = {
      allowNegative: this.props.allowNegative === false ? false : true,
      allowFloat: this.props.allowFloat === false ? false : true,
    }
    if (displayValue === "") {
      this.setValues({displayValue, exportValue: 0});
    } else if (displayValue === "-" && options.allowNegative) {
      this.setValues({displayValue, exportValue: 0});
    } else {

      function generalReplace(displayValue) {
        var forbidden = options.allowNegative ? RegExp('[^0-9,-]', 'g') : RegExp('[^0-9,]', 'g');
        return displayValue.replace(forbidden, '');
      }

      function commaProcess(displayValue, options) {
        if (!options.allowFloat) return {displayValue, exportValue: displayValue};

        var commaAtEndOfString = RegExp(',$', 'g');
        var commasAnywhere = RegExp(',', 'g');
        var commasFound = displayValue.match(commasAnywhere) || [];
        var exportValue = displayValue;

        if (commasFound.length === 1) {
          if (commaAtEndOfString.test(displayValue)) {
            exportValue = displayValue.replace(commaAtEndOfString, '');
          } else {
            exportValue = displayValue.replace(commasAnywhere, '.');
          }
        }
        return {displayValue, exportValue};
      }
      displayValue = generalReplace(displayValue);
      this.setValues(commaProcess(displayValue, options));
    }
  }

  setValues = ({displayValue, exportValue}) => {
    exportValue = Number(exportValue);
    if (!isNaN(exportValue)) {

      var min = this.props.min;
      var max = this.props.max;

      if (exportValue > max) {
        exportValue = max;
        displayValue = max.toString();
      } else if (exportValue < min && displayValue !== "-" && displayValue !== "") {
        exportValue = min;
        displayValue = min.toString();
      }

      this.setState({ displayValue }, () => {
        this.props.onChange(exportValue);
      })
    }
  }

  render() {
    return (
      <input
        value={this.state.displayValue}
        onChange={this.onChange}

        min={this.props.min}
        max={this.props.max}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}