import React from 'react';
import { Meteor } from 'meteor/meteor';

import Cep from './Cep/index';
import Checkbox from './Checkbox/index';
import Currency from './Currency/index';
import Code from './Code/index';
import Digits from './Digits/index';
import Text from './Text/index';
import DatePicker from './DatePicker/index';
import Select from './Select/index';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.className = "input " + "input--"+ this.props.type;
  }
  onChange = (e) => {
    e.target.name = this.props.name;
    e.target.id = this.props.id;
    this.props.onChange(e);
  }
  render() {
    var ChosenComponent;
    switch (this.props.type) {
      case 'currency':
        ChosenComponent = Currency;
        break;
      case 'phone':
      case 'cnpj':
      case 'cpf':
      case 'cep':
        ChosenComponent = Cep;
        break;
      case 'email':
        ChosenComponent = Code;
        break;
      case 'number':
        ChosenComponent = Digits;
        break;
      case 'calendar':
        ChosenComponent = DatePicker;
        break;
      case 'select':
        ChosenComponent = Select;
        break;
      case 'checkbox':
        ChosenComponent = Checkbox;
        break;
      default:
        ChosenComponent = Text;
    }
    return (
      <div className={this.className}>
        {this.props.title ?
          <label>{this.props.title}</label>
        : null}
        <ChosenComponent
          value={this.props.value}
          onChange={this.onChange}
          type={this.props.type}

          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          buttonClick={this.props.buttonClick}
          options={this.props.options}>
          {this.props.children}
        </ChosenComponent>
      </div>
    )
  }
}