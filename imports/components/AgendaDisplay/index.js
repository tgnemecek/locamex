import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

import ContentCell from './ContentCell/index';

export default class AgendaDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear()
    }
  }

  changeMonth = (value) => {
    var selectedMonth = this.state.selectedMonth + value;
    var selectedYear = this.state.selectedYear;

    if (selectedMonth > 11) {
      selectedMonth = 0;
      selectedYear++;
    } else if (selectedMonth < 0) {
      selectedMonth = 11;
      selectedYear--;
    }
    this.setState({ selectedMonth, selectedYear });
  }

  renderTitle = () => {
    return (
      <div className="agenda__month-title">
        <button onClick={() => this.changeMonth(-1)}>
          <Icon icon="arrowLeft"/>
        </button>
        <h3>
          {moment().month(this.state.selectedMonth).format('MMMM') + ", " + this.state.selectedYear}
        </h3>
        <button onClick={() => this.changeMonth(1)}>
          <Icon icon="arrowRight"/>
        </button>
      </div>
    )
  }

  renderHeader = () => {
    return (
      <thead>
        <tr>
          <th>Dom</th>
          <th>Seg</th>
          <th>Ter</th>
          <th>Qua</th>
          <th>Qui</th>
          <th>Sex</th>
          <th>Sáb</th>
        </tr>
      </thead>
    )
  }

  renderBody = () => {
    var monthLength = new Date(this.state.selectedYear, (this.state.selectedMonth + 1), 0).getDate();
    var startingWeekDay = new Date(this.state.selectedYear, (this.state.selectedMonth), 1).getDay();
    var lastMonthLength = new Date(this.state.selectedYear, (this.state.selectedMonth), 0).getDate();
    var nextMonthDays = 42 - (startingWeekDay + monthLength);
    var days = [];

    const getDate = (num) => {
      return moment().year(this.state.selectedYear).month(this.state.selectedMonth).date(num);
    }

    var filteredAgenda = this.props.agendaDatabase.filter((event) => {
      if (moment(event.date).year() !== this.state.selectedYear) {
        return false;
      }
      if (moment(event.date).month() !== this.state.selectedMonth) {
        return false;
      }
      return true;
    })

    for (var i = (lastMonthLength - startingWeekDay + 1); i <= lastMonthLength; i++) {
      days.push({
        dayIndex: i,
        date: getDate(i),
        isActive: false,
        events: []
      })
    }
    for (var i = 1; i <= monthLength; i++) {
      var events = filteredAgenda.filter((event) => {
        return event.date.getDate() === i;
      })
      days.push({
        dayIndex: i,
        date: getDate(i),
        isActive: true,
        events
      })
    }
    for (var i = 1; i <= nextMonthDays; i++) {
      days.push({
        dayIndex: i,
        date: getDate(i),
        isActive: false,
        events: []
      })
    }

    var weekOne = days.slice(0, 7);
    var weekTwo = days.slice(7, 14);
    var weekThree = days.slice(14, 21);
    var weekFour = days.slice(21, 28);
    var weekFive = days.slice(28, 35);
    var weekSix = days.slice(35);

    var allWeeks = [weekOne, weekTwo, weekThree, weekFour, weekFive, weekSix];

    const mapDays = (days) => {
      const className = (day) => {
        if (day.isActive) {
          if (day.events.length) {
            return "agenda__day--active agenda__day--content";
          } else return "agenda__day--active";
        } else return "agenda__day--inactive";
      }
      const isToday = (day) => {
        if (this.state.selectedMonth === new Date().getMonth()
          && this.state.selectedYear === new Date().getFullYear()
          && day.dayIndex === moment().date()) {
            return true;
          }
          return false;
      }
      return days.map((day, i) => {
        return (
          <ContentCell
            key={i}
            {...day}
            className={className(day)}
            isToday={isToday(day)}
          />
        )
        // if (day.events.length) {
        //   return <ContentCell key={i} {...day} className={className(day)}/>
        // } else return <td key={i} className={className(day)}>{day.date.format("DD")}</td>
      })
    }

    return allWeeks.map((week, i) => {
      return (
        <tr key={i}>
          {mapDays(week)}
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="agenda">
        <h2>Agenda</h2>
        {this.renderTitle()}
        <table className="agenda__table">
          {this.renderHeader()}
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
      </div>
    )
  }
}