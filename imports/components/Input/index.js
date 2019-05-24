import React from 'react';
import { Meteor } from 'meteor/meteor';

import Cep from './Cep/index';
import Checkbox from './Checkbox/index';
import Currency from './Currency/index';
import Code from './Code/index';
import Digits from './Digits/index';
import Text from './Text/index';
import DatePicker from './DatePicker/index';
import Password from './Password/index';
import Select from './Select/index';
import TextArea from './TextArea/index';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      showError: false
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    } if (prevProps.error !== this.props.error) {
      this.setState({ showError: true });
    }
  }
  onChange = (exportValue) => {
    if (exportValue === undefined) throw new Meteor.Error('exportValue is undefined in ' + this.props.name);

    var e = {
      target: {
        value: exportValue,
        name: this.props.name,
        id: this.props.id,
        extra: this.props.extra
      }
    }
    this.props.onChange(e);
    this.setState({ value: exportValue, showError: false });
  }
  style = () => {
    if (this.props.error && this.state.showError) {
      return {
        ...this.props.style,
        borderColor: "red"
      }
    } else return this.props.style;
  }

  render() {
    var ChosenComponent;
    switch (this.props.type) {
      case 'currency':
        ChosenComponent = Currency;
        break;
      case 'cep':
        ChosenComponent = Cep;
        break;
      case 'phone':
      case 'cnpj':
      case 'cpf':
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
      case 'textarea':
        ChosenComponent = TextArea;
        break;
      case 'password':
        ChosenComponent = Password;
        break;
      default:
        ChosenComponent = Text;
    }
    return (
      <div className={"input " + "input--"+ this.props.type + " " + this.props.className}>
        {this.props.title ?
          <label style={this.props.labelStyle}>{this.props.title}</label>
        : null}
        <ChosenComponent
          {...this.props}
          style={this.style()}
          value={this.state.value}
          onChange={this.onChange}
          // style={this.props.style}
          // type={this.props.type}
          // id={this.props.id}
          //
          // readOnly={this.props.readOnly}
          // placeholder={this.props.placeholder}
          // disabled={this.props.disabled}
          // buttonClick={this.props.buttonClick}
          // min={this.props.min}
          // max={this.props.max}
          // options={this.props.options}
          >
          {this.props.children}
        </ChosenComponent>
      </div>
    )
  }
}