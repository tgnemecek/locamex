import React from "react";
import moment from "moment";
import { withTracker } from "meteor/react-meteor-data";
import tools from "/imports/startup/tools/index";
import { Events } from "/imports/api/events/index";
import { Contracts } from "/imports/api/contracts/index";

import Icon from "/imports/components/Icon/index";

import ContentCell from "./ContentCell/index";
import ContentDisplay from "./ContentDisplay/index";
import Legend from "./Legend/index";
import ColorBox from "./ColorBox/index";

class Agenda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMonth: moment().month(),
      selectedYear: moment().year(),
      selectedDate: moment(),
    };
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
  };

  changeSelectedDate = (selectedDate, events) => {
    this.setState({ selectedDate });
  };

  jumpToToday = () => {
    this.setState({
      selectedMonth: moment().month(),
      selectedYear: moment().year(),
      selectedDate: moment(),
    });
  };

  renderTitle = () => {
    return (
      <div className="agenda__month-title">
        <button
          className="agenda__jump-arrow"
          onClick={() => this.changeMonth(-1)}
        >
          <Icon icon="arrowLeft" />
        </button>
        <h3>
          {moment().month(this.state.selectedMonth).format("MMMM") +
            ", " +
            this.state.selectedYear}
        </h3>
        <button
          className="agenda__jump-arrow"
          onClick={() => this.changeMonth(1)}
        >
          <Icon icon="arrowRight" />
        </button>
        <button
          className="button--pill agenda__jump-to-today"
          onClick={this.jumpToToday}
        >
          HOJE
        </button>
      </div>
    );
  };

  renderBody = () => {
    var monthLength = new Date(
      this.state.selectedYear,
      this.state.selectedMonth + 1,
      0
    ).getDate();
    var startingWeekDay = new Date(
      this.state.selectedYear,
      this.state.selectedMonth,
      1
    ).getDay();
    var lastMonthLength = new Date(
      this.state.selectedYear,
      this.state.selectedMonth,
      0
    ).getDate();
    var nextMonthDays = 42 - (startingWeekDay + monthLength);
    var days = [];

    const getDate = (num) => {
      return moment()
        .year(this.state.selectedYear)
        .month(this.state.selectedMonth)
        .date(num);
    };

    var filteredEvents = this.props.eventsDatabase.filter((event) => {
      if (moment(event.date).year() !== this.state.selectedYear) {
        return false;
      }
      if (moment(event.date).month() !== this.state.selectedMonth) {
        return false;
      }
      return true;
    });

    for (
      var i = lastMonthLength - startingWeekDay + 1;
      i <= lastMonthLength;
      i++
    ) {
      days.push({
        date: getDate(i),
        isActive: false,
        events: [],
      });
    }
    for (var i = 1; i <= monthLength; i++) {
      var events = filteredEvents.filter((event) => {
        return event.date.getDate() === i;
      });
      days.push({
        date: getDate(i),
        isActive: true,
        events,
      });
    }
    for (var i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: getDate(i),
        isActive: false,
        events: [],
      });
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
            selectedYear={this.state.selectedYear}
            selectedMonth={this.state.selectedMonth}
            selectedDate={this.state.selectedDate}
            changeSelectedDate={this.changeSelectedDate}
          />
        );
      });
    };

    return allWeeks.map((week, i) => {
      return <tr key={i}>{mapDays(week)}</tr>;
    });
  };

  render() {
    return (
      <div className="agenda">
        {this.renderTitle()}
        <table className="agenda__table">
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
          <tbody>{this.renderBody()}</tbody>
        </table>
        <Legend
          ColorBox={ColorBox}
          eventsDatabase={this.props.eventsDatabase}
        />
        <ContentDisplay
          ColorBox={ColorBox}
          selectedDate={this.state.selectedDate}
          events={this.props.eventsDatabase}
        />
      </div>
    );
  }
}

export default AgendaWrapper = withTracker((props) => {
  Meteor.subscribe("eventsPub");
  Meteor.subscribe("contractsPub");
  var eventsDatabase = Events.find().fetch() || [];
  var contractsDatabase =
    Contracts.find({
      status: { $nin: ["inactive", "cancelled"] },
    }).fetch() || [];

  contractsDatabase.forEach((contract) => {
    var snapshot = contract.snapshots.find((snapshot) => {
      return snapshot.active;
    });

    function getBillEvents(snapshot, billingName, contract) {
      var result = [];
      var arr;
      if (billingName === "billingProrogation") {
        arr = tools.prepareProrogation(snapshot, contract.status);
      } else {
        arr = snapshot[billingName];
      }
      arr.forEach((bill, i, arr) => {
        var status = tools.getBillStatus(bill);
        var textObj = tools.translateBillStatus(status, billingName);
        var statusJSX = (
          <span className={textObj.className}>{textObj.text}</span>
        );

        var description;
        switch (billingName) {
          case "billingProducts":
            description = `Contrato ${
              contract._id
            }: Vencimento da Cobrança de Locação ${i + 1}/${
              arr.length
            }. Status: `;
            break;
          case "billingServices":
            description = `Contrato ${
              contract._id
            }: Vencimento da Cobrança de Serviço ${i + 1}/${
              arr.length
            }. Status: `;
            break;
          case "billingProrogation":
            description = `Contrato ${
              contract._id
            }: Vencimento da Cobrança de Locação PRO #${i + 1}. Status: `;
            break;
        }

        result.push({
          description: (
            <span>
              {description}
              {statusJSX}
            </span>
          ),
          type: billingName,
          subType: status,
          date: bill.expiryDate,
          legend: textObj.text,
          link: "/billing/" + contract._id,
        });
      });
      return result;
    }

    var productsEvents = getBillEvents(snapshot, "billingProducts", contract);
    var servicesEvents = getBillEvents(snapshot, "billingServices", contract);
    var prorogationEvents = getBillEvents(
      snapshot,
      "billingProrogation",
      contract
    );

    eventsDatabase = eventsDatabase
      .concat(productsEvents, servicesEvents, prorogationEvents)
      .map((event) => {
        return { ...event, color: tools.getEventColor(event) };
      });
  });
  return { eventsDatabase };
})(Agenda);

// export default class AgendaDisplayWrapper extends React.Component {
//   eventsDatabase = () => {
//     var eventsDatabase = [...this.props.databases.eventsDatabase];
//     this.props.databases.contractsDatabase.forEach((contract) => {
//       if (contract.status === "active") {
//         contract.snapshots[contract.activeVersion].billingProducts.forEach((item, i, arr) => {
//           var status = tools.getBillingStatus(item);
//           var statusText = tools.renderBillingStatus(status, 'billingProducts');
//
//           eventsDatabase.push({
//             description: `Contrato ${contract._id}: Vencimento da Cobrança de Locação ${i+1}/${arr.length}. Status: `,
//             type: "billing",
//             date: item.expiryDate,
//             referral: contract._id,
//             status
//           })
//         })
//         var billingProrogation = contract.snapshots[contract.activeVersion].billingProrogation || [];
//         billingProrogation.forEach((item, i, arr) => {
//           var status = tools.getBillingStatus(item);
//           var statusText = tools.renderBillingStatus(status, 'billingProducts');
//
//           eventsDatabase.push({
//             description: `Contrato ${contract._id}: Vencimento da Cobrança de Locação PRO #${i+1}. Status: `,
//             type: "billing",
//             date: item.expiryDate,
//             referral: contract._id,
//             status
//           })
//         })
//         contract.snapshots[contract.activeVersion].billingServices.forEach((item, i, arr) => {
//           var status = tools.getBillingStatus(item);
//           var statusText = tools.renderBillingStatus(status, 'billingServices');
//
//           eventsDatabase.push({
//             description: `Contrato ${contract._id}: Vencimento da Cobrança de Serviço ${i+1}/${arr.length}. Status: `,
//             type: "billing",
//             date: item.expiryDate,
//             referral: contract._id,
//             status
//           })
//         })
//       }
//     })
//     return eventsDatabase;
//   }
//   render() {
//     return <AgendaDisplay eventsDatabase={this.eventsDatabase()}/>
//   }
// }
