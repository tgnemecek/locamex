import React from 'react';
import { Meteor } from 'meteor/meteor';

import checkCep from '/imports/api/check-cep/index';
import tools from '/imports/startup/tools/index';

export default class Cep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: 0
    }
  }
  checkCep = () => {
    var value = tools.unformat(this.props.value, this.props.type);
    if (value === undefined) return;
    if (value.length == 8) {
      checkCep(value, (checkCepData) => {
        if (checkCepData.cep) {
          this.setState({ valid: 1 });
          this.props.buttonClick(checkCepData);
        }
        else this.setState({ valid: -1 });
      })
    }
  }
  onChange = (e) => {
    if (e) {
      var inputValue = e.target.value;
      var exportValue = tools.unformat(inputValue, this.props.type);
      this.props.onChange(exportValue);
      if (inputValue.length < 9) this.setState({ valid: 0 });
    }
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

  render() {
    return (
      <>
        <input
          value={tools.format(this.props.value, this.props.type)}
          onChange={this.onChange}

          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}

          style={this.styleChanger()}/>
          <button className="custom-input--cep__button" onClick={this.checkCep}>↺</button>
      </>
    )
  }
}