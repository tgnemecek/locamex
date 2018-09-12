import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: 0
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
    }
  }
  validateCode = (value, type) => {
    var valid;
    if (type === 'email') {
      valid = tools.checkEmail(value);
    } else if (type === 'cnpj') {
      valid = tools.checkCNPJ(value);
    } else if (type === 'cpf') {
      valid = tools.checkCpf(value);
    } else {
      valid = -1;
    }
    if (valid === true) { valid = 1 };
    this.setState({ valid });
  }
  styleChanger = () => {
    var style = {...this.props.style};
    if (this.state.valid === 1) {
      style.borderColor = "green";
    } else if (this.state.valid !== 0) {
      style.borderColor = "red";
    }
    return style;
  }
  onChange = (e) => {
    if (e) {
      this.cursor = e.target.selectionStart;
      var inputValue = e.target.value;
      var exportValue;
      var displayValue = tools.format(inputValue, this.props.type);

      exportValue = tools.unformat(inputValue, this.props.type);

      var cursorStart = cursorStart + (displayValue.length - inputValue.length);
      if (inputValue.length) {
        this.validateCode(displayValue, this.props.type);
      } else this.setState({ valid: 0 });

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

        style={this.styleChanger()}
        />
    )
  }
}