import React  from 'react';
import moment from 'moment';
import Icon from '/imports/components/Icon/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class CalendarBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthIndex: new Date(this.props.value).getMonth(),
      yearIndex: new Date(this.props.value).getFullYear(),
      dayIndex: 1,
      selectedDate: this.props.value || new Date()
    }
  }

  changeMonth = (change) => {
    var monthIndex = this.state.monthIndex + Number(change);
    var yearIndex = this.state.yearIndex;

    if (monthIndex > 11) {
      monthIndex = 0;
      yearIndex++;
    } else if (monthIndex < 0) {
      monthIndex = 11;
      yearIndex--;
    }
    this.setState({ monthIndex, yearIndex });
  }

  renderDays = () => {
    var monthLength = new Date(this.state.yearIndex, (this.state.monthIndex + 1), 0).getDate();
    var startingWeekDay = new Date(this.state.yearIndex, (this.state.monthIndex), 1).getDay();
    var lastMonthLength = new Date(this.state.yearIndex, (this.state.monthIndex), 0).getDate();
    var nextMonthDays = 42 - (startingWeekDay + monthLength);
    var days = [];

    var determineClassName = (day) => {
      var selectedDate = this.state.selectedDate;
      var yearIndex = this.state.yearIndex;
      var monthIndex = this.state.monthIndex;
      var dayIndex = this.state.dayIndex;
      if (selectedDate.getFullYear() == yearIndex && selectedDate.getMonth() == monthIndex) {
        return day == selectedDate.getDate() ? "calendar-bar__box__day--active" : null;
      }
    }

    for (var i = (lastMonthLength - startingWeekDay + 1); i <= lastMonthLength; i++) {
      days.push(<td key={i} className="calendar-bar__box__day--grayed">{i}</td>);
    }
    for (var i = 1; i <= monthLength; i++) {
      days.push(<td key={i}><button value={i} className={determineClassName(i)} onClick={this.selectDay}>{i}</button></td>);
    }
    for (var i = 1; i <= nextMonthDays; i++) {
      days.push(<td key={i} className="calendar-bar__box__day--grayed">{i}</td>);
    }

    var weekOne = days.slice(0, 7);
    var weekTwo = days.slice(7, 14);
    var weekThree = days.slice(14, 21);
    var weekFour = days.slice(21, 28);
    var weekFive = days.slice(28, 35);
    var weekSix = days.slice(35);

    var allWeeks = [weekOne, weekTwo, weekThree, weekFour, weekFive, weekSix];

    return allWeeks.map((week, i) => {
      return (
        <tr key={i}>
          {week}
        </tr>
      )
    })
  }

  selectDay = (e) => {
    var selectedDate = new Date(this.state.yearIndex, this.state.monthIndex, Number(e.target.value));
    this.setState({ selectedDate });
  }

  saveEdits = () => {
    this.props.changeDate(this.state.selectedDate);
    this.props.closeCalendar();
  }

  render() {
      return (
        <Box closeBox={this.props.closeCalendar}>
          <div className="calendar-bar__box__header">
            <button onClick={() => this.changeMonth(-1)}>
              <Icon icon="arrowLeft" />
            </button>
            <h3>{moment().month(this.state.monthIndex).format('MMMM') + "/" + this.state.yearIndex}</h3>
            <button onClick={() => this.changeMonth(1)}>
              <Icon icon="arrowRight" />
            </button>
          </div>
          <table className="calendar-bar__box__table">
            <tbody>
              <tr>
                <th>Dom</th>
                <th>Seg</th>
                <th>Ter</th>
                <th>Qua</th>
                <th>Qui</th>
                <th>Sex</th>
                <th>Sáb</th>
              </tr>
              {this.renderDays()}
            </tbody>
          </table>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.closeCalendar},
            {text: "OK", className: "button--primary", onClick: this.saveEdits},
          ]}/>
        </Box>
      )
  }
}