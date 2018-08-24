import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: tools.format(this.props.value, 'currency'),
      exportValue: this.props.value
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        displayValue: tools.format(this.props.value, 'currency'),
        exportValue: this.props.value
       });
    }
  }
  onChange = (e) => {
    if (e) {
      var obj = e.target;
      var cursorStart = obj.selectionStart;
      var cursorEnd = obj.selectionEnd;
      var inputValue = e.target.value;
      var displayValue;
      var exportValue;
      var maxLength = 9999;
      if (inputValue.length > maxLength) {
        var toCut = inputValue.length - maxLength;
        inputValue = inputValue.slice(0, (0 - toCut));
      }
      displayValue = tools.format(cleanCurrency(inputValue), 'currency');
      exportValue = cleanCurrency(inputValue);

      cursorStart = cursorStart + (displayValue.length - inputValue.length);
      cursorEnd = cursorEnd + (displayValue.length - inputValue.length);

      var e = {
        target: {
          value: exportValue,
          name: this.props.name,
          id: this.props.id
        }
      }
      obj.setSelectionRange(cursorStart, cursorEnd);
      this.props.onChange(e);
    }
    function cleanCurrency(inputValue) {
      inputValue = inputValue.replace(/\D+/g, '');
      return Number(inputValue) / 100;
    }
  }
  render() {
    return (
      <input
        value={this.state.displayValue}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.state.style}
        />
    )
  }
}