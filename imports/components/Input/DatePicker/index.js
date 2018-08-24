import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Calendar from '/imports/components/Calendar/index';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: moment(this.props.value).format("DD-MMMM-YYYY"),
      exportValue: this.props.value || new Date(),
      toggleCalendar: false,
      style: {cursor: 'pointer'}
    }
  }

  toggleCalendar = () => {
    var toggleCalendar = !this.state.toggleCalendar;
    this.setState({ toggleCalendar });
  }

  changeDate = (exportValue) => {
    var displayValue = moment(exportValue).format("DD-MMMM-YYYY");
    this.setState({ displayValue, exportValue });
  }

  onClick = (e) => {
    if (e) {
      var e = {
        target: {
          value: exportValue,
          name: this.props.name,
          id: this.props.id
        }
      }
      this.props.onChange(e);
    }
  }

  render() {
    return (
      <>
        <input
          value={this.state.displayValue}
          onClick={this.toggleCalendar}

          readOnly={true}
          disabled={this.props.disabled}

          style={this.state.style}
          />
          {this.state.toggleCalendar ?
            <Calendar value={this.state.exportValue} closeCalendar={this.toggleCalendar} changeDate={this.changeDate}/>
          : null}
      </>
    )
  }
}