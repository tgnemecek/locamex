import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '/imports/startup/custom-types';

export default class CustomInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: '',
      exportValue: '',
      style: {}
    }
  };

  componentDidMount() {
    if (this.props.value) {
      this.formatValue(this.props.value);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.formatValue(this.props.value);
    }
    if (this.props.forceInvalid !== prevProps.forceInvalid) {
      this.redBorder(this.props.forceInvalid);
    }
  }

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
        if (!customTypes.checkPhone(value)){
          this.redBorder(true);
          return '';
        }
        break;
      case 'email':
        if (!customTypes.checkEmail(value)){
          this.redBorder(true);
          return '';
        }
        break;
      case 'cnpj':
        if (!customTypes.checkCNPJ(value)){
          this.redBorder(true);
          return '';
        }
        break;
      case 'cpf':
        if (!customTypes.checkCPF(value)){
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

    inputValue = inputValue.toString();
    let displayValue = inputValue;
    let exportValue = inputValue;

    let options = {
      allowNegative: false,
      fromInput: true
    };

    if (inputValue !== undefined) {
      switch (this.props.type) {
        case 'currency':
          displayValue = customTypes.format(inputValue, this.props.type, options);
          exportValue = customTypes.format(displayValue, 'numberFromCurrency');
          break;
        case 'number':
          if (this.props.max && (Number(inputValue) > this.props.max)) inputValue = this.props.max;
        case 'cpf':
        case 'cnpj':
        case 'phone':
        case 'zip':
          displayValue = customTypes.format(inputValue, this.props.type);
          exportValue = displayValue.replace(/\D+/g, '');
          break;
        default:
          exportValue = displayValue;
      }
    }
    if (this.props.upperCase && this.props.type == "text") {
      displayValue = displayValue.toUpperCase();
      exportValue = exportValue.toUpperCase();
    }
    start = start + (displayValue.length - inputValue.length);
    end = end + (displayValue.length - inputValue.length);
    this.setState({
      displayValue,
      exportValue
    }, () => {
      this.props.onChange(this.props.name, this.validateInput(exportValue), this.props.id, this.state.valid);
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