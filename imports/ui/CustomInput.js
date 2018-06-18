import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '../startup/custom-types';

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
    if (this.props.defaultValue) {
      this.formatValue(this.props.defaultValue.toString());
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

  formatValue = (inputValue) => {
    let displayValue = inputValue;
    let exportValue = inputValue;

    if (inputValue) {
      displayValue = customTypes.format(inputValue, this.props.type);
      switch (this.props.type) {
        case 'cpf':
        case 'cnpj':
        case 'number':
        case 'phone':
          exportValue = displayValue.replace(/\D+/g, '');
          break;
        default:
          exportValue = displayValue;
      }
    }
    this.setState({
      displayValue,
      exportValue
    }, () => {this.props.onChange(this.props.name, this.validateInput(exportValue), this.props.id, this.state.valid)});
  }

  onChange = (e) => {
    this.formatValue(e.target.value);
  }

  render() {
    return <input
              ref="input"
              style={this.state.style}
              value={this.state.displayValue}
              onChange={this.onChange}>
              </input>;
  }
}