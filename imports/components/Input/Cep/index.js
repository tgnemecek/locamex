import React from 'react';
import { Meteor } from 'meteor/meteor';

import checkCep from '/imports/api/check-cep/index';
import tools from '/imports/startup/tools/index';

export default class Cep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: tools.format(this.props.value, this.props.type),
      exportValue: this.props.value,
      style: {}
    }
  }
  checkCep = () => {
    var value = this.state.exportValue;
    if (value === undefined) return;
    if (value.length == 8) {
      checkCep(value, (checkCepData) => {
        if (checkCepData) {
          this.setState({ style: {} });
          this.props.buttonClick(checkCepData);
        }
        else this.setState({ style: {borderColor: 'red'} });
      })
    } else if (value.length < 8 || value.length > 8) this.setState({ style: {} });
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
      displayValue = tools.format(inputValue, this.props.type);
      exportValue = tools.unformat(inputValue, this.props.type);

      cursorStart = cursorStart + (displayValue.length - inputValue.length);
      cursorEnd = cursorEnd + (displayValue.length - inputValue.length);

      obj.setSelectionRange(cursorStart, cursorEnd);
      this.props.onChange(exportValue);
      this.setState({ displayValue, exportValue });
    }
  }

  render() {
    return (
      <>
        <input
          value={this.state.displayValue}
          onChange={this.onChange}

          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}

          style={this.state.style}/>
          <button className="custom-input--cep__button" onClick={this.checkCep}>↺</button>
      </>
    )
  }
}