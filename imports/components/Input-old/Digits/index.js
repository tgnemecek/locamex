import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Digits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: '',
      blurValue: false
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
          if (this.props.percent) {
            value = Math.round((Number(value) * 100));
          }
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
      allowFloat: this.props.allowFloat === false ? false : true
    }
    if (displayValue === "") {
      this.setValues({ displayValue });
      return;
    }
    if (displayValue === "-" && options.allowNegative) {
      this.setValues({ displayValue });
      return;
    }
    function generalReplace(displayValue) {
      // First we remove all bad characters
      displayValue = displayValue.replace(/[^0-9,-]/g, '');
      // Then we replace all '-' except the first
      return displayValue.replace(/(-?)([^-]*)(-*)/g, '$1$2');
    }
    function commaProcess(displayValue, options) {
      if (!options.allowFloat) {
        return {displayValue, exportValue: displayValue};
      }

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

  setValues = ({displayValue, exportValue}) => {
    exportValue = Number(exportValue || 0);

    var blurValue;
    var skipExport = false;
    var min = this.props.min;
    var max = this.props.max;

    if (displayValue === "-" || displayValue === "") {
      blurValue = this.state.blurValue;
      skipExport = true;
    } else {
      if (exportValue > max) {
        exportValue = max;
        displayValue = max.toString();
      } else if (exportValue < min) {
        exportValue = min;
        displayValue = min.toString();
      }
      blurValue = displayValue;
    }
    if (this.props.percent) {
      exportValue = tools.round((Number(exportValue) / 100), 2);
    }
    this.setState({ displayValue, blurValue }, () => {
      if (!skipExport) this.props.onChange(exportValue);
    })
  }

  onBlur = () => {
    var blurValue = this.state.blurValue;
    var displayValue = this.state.displayValue;
    if (blurValue !== displayValue) {
      this.setState({ displayValue: blurValue });
    }
  }

  render() {
    return (
      <input
        value={this.state.displayValue}
        onChange={this.onChange}
        onBlur={this.onBlur}

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