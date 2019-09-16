import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

export default class ContentCell extends React.Component {
  isToday = () => {
    var today = moment();
    return (
      today.year() === this.props.date.year()
      && today.month() === this.props.date.month()
      && today.date() === this.props.date.date()
    )
  }

  isSelected = () => {
    return (
      this.props.isActive
      && this.props.selectedDate.year()  === this.props.date.year()
      && this.props.selectedDate.month()  === this.props.date.month()
      && this.props.selectedDate.date() === this.props.date.date()
    )
  }

  changeSelectedDate = () => {
    if (this.props.isActive) {
      this.props.changeSelectedDate(this.props.date, this.props.events);
    }
  }

  tdClassName = () => {
    var result = "";
    if (this.props.isActive) {
      result = "agenda__day--active";
    } else result = "agenda__day--inactive";

    if (this.props.events.length) result += " agenda__day--content";
    if (this.isSelected()) result += " agenda__day--selected";

    return result;
  }

  dateClassName = () => {
    var result = "agenda__day__date ";
    if (this.isToday()) result += "agenda__day__date--today";
    return result;
  }

  renderContent = () => {
    return this.props.events.map((event, i) => {
      var className = "agenda__color-box--" + event.status;
      return (
        <div key={i} className={className}>
          <Icon icon="star" className="agenda__star"/>
        </div>
      )
    })
  }

  render() {
    return (
      <td className={this.tdClassName()}>
        <button onClick={this.changeSelectedDate}>
          <div className="agenda__day__cell__content">
            {this.renderContent()}
          </div>
          <div className={this.dateClassName()}>
            <p>
              {this.props.date.format("DD")}
            </p>
          </div>
        </button>
      </td>
    )
  }
}