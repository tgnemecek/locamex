import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import validateInput from './validateInput/index';

export default class CustomInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: this.props.value,
      exportValue: this.props.value,
      style: {}
    }
  }
  componentDidMount() {
    this.setState({
      displayValue: tools.format(this.props.value, this.props.type),
      exportValue: this.props.value
     });
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        displayValue: tools.format(this.props.value, this.props.type),
        exportValue: this.props.value
       });
    }
  }
  tintBorder = (value) => {
    var bool = validateInput(value, this.props.type);
    const style = {
      borderColor: 'red'
    }
    bool ? this.setState({ style }) : this.setState({ style: {} });
  }
  onChange = (e) => {
    if (e) {
      var obj = e.target;
      var cursorStart = obj.selectionStart;
      var cursorEnd = obj.selectionEnd;
      var inputValue = e.target.value;
      var displayValue;
      var exportValue;
      var maxLength = 9999;
      if (this.props.type == 'number') {
        maxLength = this.props.maxLength ? this.props.maxLength : 15;
        if (this.props.max !== undefined && (Number(inputValue) > this.props.max)) inputValue = this.props.max;
        if (this.props.min !== undefined && (Number(inputValue) < this.props.min)) inputValue = this.props.min;
      }
      if (inputValue.length > maxLength) {
        var toCut = inputValue.length - maxLength;
        inputValue = inputValue.slice(0, (0 - toCut));
      }
      if (this.props.type == 'currency') {
        displayValue = tools.format(cleanCurrency(inputValue), this.props.type);
        exportValue = cleanCurrency(inputValue);
      } else {
        displayValue = tools.format(inputValue, this.props.type);
        exportValue = displayValue;
      }
      cursorStart = cursorStart + (displayValue.length - inputValue.length);
      cursorEnd = cursorEnd + (displayValue.length - inputValue.length);

      this.tintBorder(exportValue);

      var e = {
        target: {
          value: exportValue,
          name: this.props.name,
          id: this.props.id
        }
      }
      obj.setSelectionRange(cursorStart, cursorEnd);
      this.props.onChange(e);
    }
    function cleanCurrency(inputValue) {
      inputValue = inputValue.replace(/\D+/g, '');
      return Number(inputValue) / 100;
    }
  }
  render() {
    return (
      <div className="custom-input">
        {this.props.title ?
          <label>{this.props.title}</label>
        : null}
        <input
          style={this.state.style}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          value={this.state.displayValue}
          onChange={this.onChange}/>
      </div>
    )
  }
}