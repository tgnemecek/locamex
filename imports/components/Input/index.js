import React from 'react';
import { Meteor } from 'meteor/meteor';

import Cep from './Cep/index';
import Checkbox from './Checkbox/index';
import Currency from './Currency/index';
import Code from './Code/index';
import Digits from './Digits/index';
import File from './File/index';
import Text from './Text/index';
import Number_ from './Number_/index';
import Password from './Password/index';
import Percent from './Percent/index';
import Select from './Select/index';
import TextArea from './TextArea/index';

export default class Input extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstChange: true
    };
  }

  onChange = (exportValue) => {
    var e = {
      target: {
        value: exportValue,
        name: this.props.name,
        id: this.props.id,
        extra: this.props.extra,
        firstChange: this.state.firstChange
      }
    }
    if (this.props.onChange) {
      this.props.onChange(e);
      this.setState({ firstChange: false });
    }
  }
  className = () => {
    var result = "input";
    result = this.props.type ? result + " input--" + this.props.type : result;
    result = this.props.className ? result + " " + this.props.className : result;
    return result;
  }
  style = () => {
    var style = {...this.props.style} || {};
    if (this.props.error) {
      style = {
        ...style,
        borderColor: "red"
      }
    }
    if (this.props.childrenSide === 'left') {
      style = {
        ...style,
        paddingLeft: "32px"
      }
    }
    if (this.props.buttonClick) {
      style = {
        ...style,
        cursor: "pointer"
      }
    }
    return style;
  }

  labelStyle = () => {
    var haslabelSpace = this.props.keepLabelHeight
                        || this.props.title;
    return {
      textAlign: "left",
      paddingLeft: "2px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      height: haslabelSpace ? "16px" : "0"
    }
  }

  renderChildren = () => {
    var side = this.props.childrenSide;
    var haslabelSpace = this.props.keepLabelHeight
                        || this.props.title;
    var style = {
      position: "absolute",
      top: haslabelSpace ? "17px" : "0",
      [side]: 0,
      textAlign: "center"
    };
    if (this.props.buttonClick) {
      style.pointerEvents = "none";
    }
    return (
      <div style={style}>
        {this.props.children}
      </div>
    )
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
        ChosenComponent = Number_;
        break;
      case 'digits':
        ChosenComponent = Digits;
        break;
      case 'percent':
        ChosenComponent = Percent;
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
      case 'file':
        ChosenComponent = File;
        break;
      default:
        ChosenComponent = Text;
    }
    return (
      <div className={this.className()} style={this.props.parentStyle}>
        <div style={this.labelStyle()}>
          {this.props.title}
        </div>
        <ChosenComponent
          {...this.props}
          style={this.style()}
          value={this.props.value}
          onChange={this.onChange}>
            {this.props.children}
        </ChosenComponent>
        {this.props.childrenSide ?
          this.renderChildren()
        : null}
      </div>
    )
  }
}