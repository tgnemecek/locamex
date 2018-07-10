import React  from 'react';
import ReactModal from 'react-modal';
import moment from 'moment';

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      monthIndex: 6, //HARD-CODED,
      yearIndex: 2018, //HARD-CODED,
      dayIndex: 1,
      selectedDate: new Date()
    }
  }

  changeMonth = (e) => {
    var monthIndex = this.state.monthIndex + Number(e.target.value);
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
        return day == selectedDate.getDate() ? "calendar__day--active" : null;
      }
    }

    for (var i = (lastMonthLength - startingWeekDay + 1); i <= lastMonthLength; i++) {
      days.push(<td key={i} className="calendar__day--grayed">{i}</td>);
    }
    for (var i = 1; i <= monthLength; i++) {
      days.push(<td key={i}><button value={i} className={determineClassName(i)} onClick={this.selectDay}>{i}</button></td>);
    }
    for (var i = 1; i <= nextMonthDays; i++) {
      days.push(<td key={i} className="calendar__day--grayed">{i}</td>);
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
  }

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Calendário"
          appElement={document.body}
          onRequestClose={this.props.closeCalendar}
          className="calendar__box"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeCalendar} className="calendar__close-button">✖</button>
              <div className="calendar__header">
                <button value={-1} onClick={this.changeMonth}>◄</button>
                <h3>{moment().month(this.state.monthIndex).format('MMMM') + "/" + this.state.yearIndex}</h3>
                <button value={+1} onClick={this.changeMonth}>►</button>
              </div>
              <table className="calendar">
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
              <div className="calendar__lower-button-div">
                <button type="button" className="button button--primary" onClick={this.saveEdits}>OK</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}