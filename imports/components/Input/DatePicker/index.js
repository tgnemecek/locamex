import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Calendar from '/imports/components/Calendar/index';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleCalendar: false
    }
  }
  toggleCalendar = () => {
    var toggleCalendar = !this.state.toggleCalendar;
    this.setState({ toggleCalendar });
  }
  changeDate = (exportValue) => {
    this.props.onChange(exportValue);
  }
  render() {
    return (
      <>
        <input
          value={moment(this.props.value).format("DD-MMMM-YYYY")}
          onClick={this.toggleCalendar}

          readOnly={true}
          disabled={this.props.disabled}

          style={this.props.style ? {...this.props.style, cursor: 'pointer'} : {cursor: 'pointer'}}
          />
          {this.state.toggleCalendar ?
            <Calendar value={this.props.value || new Date()} closeCalendar={this.toggleCalendar} changeDate={this.changeDate}/>
          : null}
      </>
    )
  }
}