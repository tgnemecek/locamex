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
  onChange = (exportValue) => {
    if (exportValue === undefined) throw new Error('exportValue is undefined in ' + this.props.name);
    var e = {
      target: {
        value: exportValue,
        name: this.props.name,
        id: this.props.id,
        extra: this.props.extra
      }
    }
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
      <div className={"input " + "input--"+ this.props.type}>
        {this.props.title ?
          <label>{this.props.title}</label>
        : null}
        <ChosenComponent key={this.props.value}
          value={this.props.value}
          onChange={this.onChange}
          type={this.props.type}
          id={this.props.id}

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