import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

import ContentCell from './ContentCell/index';
import ContentDisplay from './ContentDisplay/index';
import Legend from './Legend/index';
import ColorBox from './ColorBox/index';
import Status from './Status/index';

class AgendaDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: moment().month(),
      selectedYear: moment().year(),
      selectedDate: moment(),
      events: []
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

  changeSelectedDate = (selectedDate, events) => {
    this.setState({ selectedDate, events });
  }

  jumpToToday = () => {
    this.setState({
      selectedMonth: moment().month(),
      selectedYear: moment().year(),
      selectedDate: moment()
    })
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
        <button className="button--pill agenda__jump-to-today" onClick={this.jumpToToday}>
          HOJE
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
      return moment()
      .year(this.state.selectedYear)
      .month(this.state.selectedMonth)
      .date(num);
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
        date: getDate(i),
        isActive: true,
        events
      })
    }
    for (var i = 1; i <= nextMonthDays; i++) {
      days.push({
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
      return days.map((day, i) => {
        return (
          <ContentCell
            key={i}
            index={i}
            {...day}
            ColorBox={ColorBox}
            selectedYear={this.state.selectedYear}
            selectedMonth={this.state.selectedMonth}
            selectedDate={this.state.selectedDate}

            changeSelectedDate={this.changeSelectedDate}
          />
        )
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
        {this.renderTitle()}
        <table className="agenda__table">
          {this.renderHeader()}
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
        <Legend
          ColorBox={ColorBox}
          Status={Status}
          agendaDatabase={this.props.agendaDatabase}
        />
        <ContentDisplay
          ColorBox={ColorBox}
          Status={Status}
          selectedDate={this.state.selectedDate}
          events={this.state.events}
        />
      </div>
    )
  }
}

export default class AgendaDisplayWrapper extends React.Component {
  agendaDatabase = () => {
    var agendaDatabase = [...this.props.databases.agendaDatabase];
    this.props.databases.contractsDatabase.forEach((contract) => {
      if (contract.status === "active") {
        contract.snapshots[contract.activeVersion].billingProducts.forEach((item, i, arr) => {
          var status = tools.getBillingStatus(item);
          var statusText = tools.renderBillingStatus(status, 'billingProducts');

          agendaDatabase.push({
            description: `Contrato ${contract._id}: Vencimento da Cobrança de Locação ${i+1}/${arr.length}. Status: `,
            type: "billing",
            date: item.expiryDate,
            referral: contract._id,
            status
          })
        })
        var billingProrogation = contract.snapshots[contract.activeVersion].billingProrogation || [];
        billingProrogation.forEach((item, i, arr) => {
          var status = tools.getBillingStatus(item);
          var statusText = tools.renderBillingStatus(status, 'billingProducts');

          agendaDatabase.push({
            description: `Contrato ${contract._id}: Vencimento da Cobrança de Locação PRO #${i+1}. Status: `,
            type: "billing",
            date: item.expiryDate,
            referral: contract._id,
            status
          })
        })
        contract.snapshots[contract.activeVersion].billingServices.forEach((item, i, arr) => {
          var status = tools.getBillingStatus(item);
          var statusText = tools.renderBillingStatus(status, 'billingServices');

          agendaDatabase.push({
            description: `Contrato ${contract._id}: Vencimento da Cobrança de Serviço ${i+1}/${arr.length}. Status: `,
            type: "billing",
            date: item.expiryDate,
            referral: contract._id,
            status
          })
        })
      }
    })
    return agendaDatabase;
  }
  render() {
    return <AgendaDisplay agendaDatabase={this.agendaDatabase()}/>
  }
}