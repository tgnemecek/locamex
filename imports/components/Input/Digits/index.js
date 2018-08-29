import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Digits extends React.Component {
  onChange = (e) => {
    if (e) {
      var obj = e.target;
      var cursorStart = obj.selectionStart;
      var cursorEnd = obj.selectionEnd;
      var inputValue = e.target.value;
      var exportValue;
      var maxLength = 9999;
      if (inputValue.length > maxLength) {
        var toCut = inputValue.length - maxLength;
        inputValue = inputValue.slice(0, (0 - toCut));
      }
      exportValue = tools.unformat(inputValue, this.props.type, this.props.options);

      // cursorStart = cursorStart - (exportValue.toString().length - inputValue.length);
      // cursorEnd = cursorEnd - (exportValue.toString().length - inputValue.length);

      
      this.props.onChange(exportValue);
      obj.setSelectionRange(cursorStart, cursorEnd);
    }
  }

  render() {
    return (
      <input
        value={tools.format(this.props.value, this.props.type)}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}