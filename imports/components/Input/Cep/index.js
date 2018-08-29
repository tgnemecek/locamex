import React from 'react';
import { Meteor } from 'meteor/meteor';

import checkCep from '/imports/api/check-cep/index';
import tools from '/imports/startup/tools/index';

export default class Cep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {}
    }
  }
  checkCep = () => {
    var value = this.state.exportValue;
    if (value === undefined) return;
    if (value.length == 8) {
      checkCep(value, (checkCepData) => {
        if (checkCepData.cep) {
          this.setState({ style: {} });
          this.props.buttonClick(checkCepData);
        }
        else this.setState({ style: {borderColor: 'red'} });
      })
    } else if (value.length < 8 || value.length > 8) this.setState({ style: {} });
  }
  onChange = (e) => {
    if (e) {
      var inputValue = e.target.value;
      var exportValue =  tools.unformat(inputValue, this.props.type);
      this.props.onChange(exportValue);
    }
  }

  render() {
    return (
      <>
        <input
          value={this.props.value}
          onChange={this.onChange}

          readOnly={this.props.readOnly}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}

          style={this.state.style}/>
          <button className="custom-input--cep__button" onClick={this.checkCep}>↺</button>
      </>
    )
  }
}