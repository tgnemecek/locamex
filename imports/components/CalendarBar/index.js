import React from 'react';
import moment from 'moment';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';
import Calendar from '/imports/components/Calendar/index';

export default class CalendarBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleCalendar: false
    }
  }
  toggleCalendar = () => {
    if (!this.props.disabled) {
      var toggleCalendar = !this.state.toggleCalendar;
      this.setState({ toggleCalendar });
    }
  }
  changeDate = (exportValue) => {
    var e = {
      target: {
        value: exportValue,
        name: this.props.name,
        extra: this.props.extra
      }
    }
    this.props.onChange(e);
  }
  className = () => {
    var fromProps = this.props.className || "";
    return "calendar-bar " + fromProps;
  }
  render() {
    return (
      <>
        <div className={this.className()}>
          <Input
            title={this.props.title}
            className="calendar-bar__input"
            value={moment(this.props.value).format("DD/MM/YYYY")}
            disabled={this.props.disabled}
            buttonClick={this.toggleCalendar}
            readOnly={true}
            childrenSide="left">
              <Icon icon="calendar" color="grey"/>
            </Input>
        </div>
        {this.state.toggleCalendar ?
          <Calendar
            value={this.props.value || new Date()}
            closeCalendar={this.toggleCalendar}
            changeDate={this.changeDate}/>
        : null}
      </>
    )
  }
}