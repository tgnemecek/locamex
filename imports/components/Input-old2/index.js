import React from 'react';
import { Meteor } from 'meteor/meteor';

import tools from '/imports/startup/tools/index';
import checkCep from '/imports/api/checkCep/index';
import validateInput from './validateInput/index';

import Calendar from '/imports/components/Calendar/index';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: tools.format(this.props.value, this.props.type),
      exportValue: this.props.value,

      checkCepData: {},
      calendarDate: '',

      style: {}
    }
    if (this.props.type == 'calendar' || this.props.readOnly) {
      this.readOnly = true;
      this.state.style = { cursor: "pointer" };
    }
    this.redBorder = {
      borderColor: 'red'
    }
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
    var redBorder = this.redBorder;
    var styleRegular = {...this.state.style};
    var styleRed = {...this.state.style, redBorder};
    bool ? this.setState({ style: styleRegular }) : this.setState({ style: styleRed });
  }
  onClick = () => {
    switch (this.props.type) {
      case 'calendar':
        this.props.toggleCalendar();
        break;
    }
  }
  changeDate = (calendarDate) => {
    this.setState({ calendarDate });
    this.props.changeDate(calendarDate);
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
        exportValue = tools.unformat(inputValue, this.props.type);;
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
  checkCep = () => {
    var value = this.state.exportValue;
    if (value.length == 8) {
      checkCep(value, (checkCepData) => {
        if (checkCepData) {
          
          this.setState({ style: {} });
          this.props.cepButtonClick(checkCepData);
        }
        else this.setState({ style: this.redBorder });
      })
    } else if (value.length < 8 || value.length > 8) this.setState({ style: {} });
  }
  render() {
    return (
      <div className="custom-input">
        {this.props.title ?
          <label>{this.props.title}</label>
        : null}
        <input
          readOnly={this.readOnly}
          style={this.state.style}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
          value={this.state.displayValue}
          onClick={this.onClick}
          onChange={this.onChange}/>
        {this.props.cepButtonClick ?
          <button onClick={this.checkCep}>↺</button>
        : null}
        {this.props.calendarOpen ? <Calendar value={this.state.exportValue} closeCalendar={this.props.toggleCalendar} changeDate={this.changeDate}/> : null}
      </div>
    )
  }
}