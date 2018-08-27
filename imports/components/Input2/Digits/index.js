import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Digits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: tools.format(this.props.value, this.props.type, this.props.options),
      exportValue: this.props.value
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
      displayValue = tools.format(inputValue, this.props.type, this.props.options);
      exportValue = tools.unformat(inputValue, this.props.type, this.props.options);

      cursorStart = cursorStart + (displayValue.toString().length - inputValue.length);
      cursorEnd = cursorEnd + (displayValue.toString().length - inputValue.length);

      obj.setSelectionRange(cursorStart, cursorEnd);
      this.props.onChange(exportValue);
      this.setState({ displayValue, exportValue });
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