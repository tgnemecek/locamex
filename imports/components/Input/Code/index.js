import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {}
    }
    this.cursor = 0;
    this.ref = React.createRef();
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.value !== prevProps.value) {
      var newCursor = this.cursor;
      var substring1 = tools.format(this.props.value.substring(0, newCursor), this.props.type);
      var substring2 = this.props.value.substring(0, newCursor);
      var subtraction = substring1.length - substring2.length;
      newCursor = newCursor + subtraction;
      this.ref.current.setSelectionRange(newCursor, newCursor);
      // if (subtraction < 0) {
      //   this.ref.current.setSelectionRange(newCursor, newCursor);
      // } else this.ref.current.setSelectionRange(this.cursor+1, this.cursor+1);
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
      this.cursor = e.target.selectionStart;
      var inputValue = e.target.value;
      var exportValue;
      var displayValue = tools.format(inputValue, this.props.type);

      exportValue = tools.unformat(inputValue, this.props.type);

      var cursorStart = cursorStart + (displayValue.length - inputValue.length);

      this.validateCode(displayValue, this.props.type);

      // e.target.setSelectionRange(cursorStart, cursorStart);
      this.props.onChange(exportValue);
    }
  }

  render() {
    return (
      <input
        value={tools.format(this.props.value, this.props.type)}
        onChange={this.onChange}
        ref={this.ref}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.state.style}
        />
    )
  }
}