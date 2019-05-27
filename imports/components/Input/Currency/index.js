import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: '',
      isInput: false
    }
  }
  componentDidMount() {
    this.calculateValues(this.props.value.toString().replace('.', ','), true);
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isInput && !prevState.isInput) {
      if (prevProps.value !== this.props.value) {
        var value = this.props.value;
        value = value.toString().replace('.', ',');
        this.calculateValues(value, true);
      }
    } else {
      this.setState({ isInput: false });
    }
  }
  onChange = (e) => {
    var displayValue = e.target.value.trim();
    this.calculateValues(displayValue, false, true);
  }
  calculateValues = (displayValue, shouldFormat, isInput) => {
    var options = {
      allowNegative: this.props.allowNegative === false ? false : true,
      allowFloat: this.props.allowFloat === false ? false : true,
      shouldFormat,
      isInput
    }
    if (displayValue === "") {
      this.setValues({displayValue, exportValue: 0, options});
    } else if (displayValue === "-" && options.allowNegative) {
      this.setValues({displayValue, exportValue: 0, options});
    } else {

      function generalReplace(displayValue) {
        var forbidden = options.allowNegative ? RegExp('[^0-9,-]', 'g') : RegExp('[^0-9,]', 'g');
        return displayValue.replace(forbidden, '');
      }

      function commaProcess(displayValue, options) {
        if (!options.allowFloat) return {displayValue, exportValue: displayValue, options};

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
        return {displayValue, exportValue, options};
      }
      displayValue = generalReplace(displayValue);
      this.setValues(commaProcess(displayValue, options), options);
    }
  }

  unformat = () => {
    var displayValue = this.state.displayValue.replace("R$", "").trim();
    this.setState({ displayValue });
  }

  format = () => {
    var displayValue = tools.format(this.state.displayValue, 'currency');
    this.setState({ displayValue });
  }

  setValues = ({displayValue, exportValue, options}) => {
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

      if (options.shouldFormat) {
        displayValue = tools.format(displayValue, 'currency');
      }

      var isInput = !!options.isInput;

      this.setState({ displayValue, isInput }, () => {
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

        onFocus={this.unformat}
        onBlur={this.format}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}