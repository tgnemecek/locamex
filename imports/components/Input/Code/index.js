import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: tools.format(this.props.value, this.props.type),
      exportValue: this.props.value,
      style: {}
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        displayValue: tools.format(this.props.value, this.props.type),
        exportValue: this.props.value
       });
    }
  }
  validateCode = (value, type) => {
    var valid;
    switch (type) {
      // case 'phone':
      //   valid = tools.checkPhone(value);
      case 'email':
        valid = tools.checkEmail(value);
      case 'cnpj':
        valid = tools.checkCNPJ(value);
      case 'cpf':
        valid = tools.checkCpf(value);
      default:
        valid = true;
    }
    var style = {borderColor: 'red'};
    valid ? this.setState({ style: {} }) : this.setState({ style });
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

      this.validateCode(displayValue, this.props.type);

      obj.setSelectionRange(cursorStart, cursorEnd);
      this.props.onChange(exportValue);
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