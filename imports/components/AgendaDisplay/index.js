import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import ContentCell from './ContentCell/index';

export default class AgendaDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear()
    }
  }

  renderTitle = () => {
    return (
      <h3 className="agenda__month-title">
        {moment().month(this.state.selectedMonth).format('MMMM') + ", " + this.state.selectedYear}
      </h3>
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
    debugger;
    var monthLength = new Date(this.state.selectedYear, (this.state.selectedMonth + 1), 0).getDate();
    var startingWeekDay = new Date(this.state.selectedYear, (this.state.selectedMonth), 1).getDay();
    var lastMonthLength = new Date(this.state.selectedYear, (this.state.selectedMonth), 0).getDate();
    var nextMonthDays = 42 - (startingWeekDay + monthLength);
    var days = [];

    const getDate = (num) => {
      return moment().year(this.state.selectedYear).month(this.state.selectedMonth).date(num);
    }

    var filteredAgenda = this.props.agendaDatabase.filter((task) => {
      if (task.date.getFullYear() !== this.state.selectedYear) return false;
      if (task.date.getMonth() !== this.state.selectedMonth) return false;
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
      function className(day) {
        if (day.isActive) {
          if (day.events.length) {
            return "agenda__day--active agenda__day--content";
          } else return "agenda__day--active";
        } else return "agenda__day--inactive";
      }
      return days.map((day, i) => {
        if (day.events.length) {
          return <ContentCell key={i} {...day} className={className(day)}/>
        } else return <td key={i} className={className(day)}>{day.date.format("DD")}</td>
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