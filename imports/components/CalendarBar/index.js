import React from 'react';
import moment from 'moment';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';
import CalendarBox from './CalendarBox/index';

export default class CalendarBar extends React.Component {
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
    var e = {
      target: {
        value: exportValue,
        name: this.props.name,
        extra: this.props.extra
      }
    }
    this.props.onChange(e);
  }
  render() {
    return (
      <>
        <div className={this.props.className ? this.props.className + " calendar-bar" : "calendar-bar"}>
          <div className="calendar-bar__icon" style={this.props.title ? {top: "2.5rem"} : {top: "1rem"}}>
            <Icon icon="calendar"/>
          </div>
          <Input
            title={this.props.title}
            className="calendar-bar__input"
            value={moment(this.props.value).format("DD/MM/YYYY")}
            buttonClick={this.toggleCalendar}

            readOnly={true}
            />
        </div>
        {this.state.toggleCalendar ?
          <CalendarBox
            value={this.props.value || new Date()}
            closeCalendar={this.toggleCalendar}
            changeDate={this.changeDate}/>
        : null}
      </>
    )
  }
}