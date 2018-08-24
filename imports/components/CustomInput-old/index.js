import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: '',
      exportValue: '',
      style: {}
    }
  };

  componentDidMount() {
    if (this.props.value !== undefined) {
      this.formatValue(this.props.value);
    }
  }
// This was commented because it was generating errors (double update), may have broken other functionality
  // componentDidUpdate(prevProps) {
  //   if (this.props.value !== prevProps.value) {
  //     this.formatValue(this.props.value);
  //   }
  //   if (this.props.forceInvalid !== prevProps.forceInvalid) {
  //     this.redBorder(this.props.forceInvalid);
  //   }
  // }

  redBorder = (bool) => {
    const style = {
      borderColor: 'red'
    }
    bool ? this.setState({ style }) : this.setState({ style: {} });
  }

  validateInput = (value) => {
    if (!value) {
      this.redBorder(false);
      return '';
    }
    switch (this.props.type) {
      case 'phone':
        if (!tools.checkPhone(value)){
          this.redBorder(true);
          return '';
        }
        break;
      case 'email':
        if (!tools.checkEmail(value)){
          this.redBorder(true);
          return '';
        }
        break;
      case 'cnpj':
        if (!tools.checkCNPJ(value)){
          this.redBorder(true);
          return '';
        }
        break;
      case 'cpf':
        if (!tools.checkCpf(value)){
          this.redBorder(true);
          return '';
        }
        break;
      }
      this.redBorder(false);
      return value;
  }

  formatValue = (inputValue, obj) => {
    let start = obj ? obj.selectionStart : 0;
    let end = obj ? obj.selectionEnd : 0;
    var displayValue;
    var exportValue;
    if (inputValue == undefined) return;
    let options = {
      allowNegative: false,
      fromInput: true
    };

    if (inputValue !== undefined) {
      inputValue = inputValue.toString();
      displayValue = inputValue;
      exportValue = inputValue;

      switch (this.props.type) {
        case 'currency':
          if (inputValue == "") {
            displayValue = inputValue;
          } else displayValue = tools.format(inputValue, this.props.type, options);
          exportValue = tools.round(inputValue, 2);
          break;
        case 'number':
          if (this.props.max !== undefined && (Number(inputValue) > this.props.max)) inputValue = this.props.max;
          if (this.props.min !== undefined && (Number(inputValue) < this.props.min)) inputValue = this.props.min;
        case 'cpf':
        case 'cnpj':
        case 'phone':
        case 'cep':
          displayValue = tools.format(inputValue, this.props.type);
          exportValue = displayValue.replace(/\D+/g, '');
          break;
        default:
          exportValue = displayValue;
      }
      if (this.props.upperCase && this.props.type == "text") {
        displayValue = displayValue.toUpperCase();
        exportValue = exportValue.toUpperCase();
      }
      start = start + (displayValue.length - inputValue.length);
      end = end + (displayValue.length - inputValue.length);
    }
    var e = {
      target: {
        value: this.validateInput(exportValue),
        name: this.props.name,
        id: this.props.id,
        valid: this.state.valid
      }
    };
    this.setState({
      displayValue,
      exportValue
    }, () => {
      this.props.onChange(e);
      obj ? obj.setSelectionRange(start, end) : null;
    });
  }

  onChange = (e) => {
    this.formatValue(e.target.value, e.target);
  }

  render() {
    return <input
              ref="input"
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              style={this.state.style}
              value={this.state.displayValue}
              onChange={this.onChange}>
              </input>;
  }
}