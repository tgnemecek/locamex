import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

export default class ContentCell extends React.Component {
  renderIcon = () => {
    if (this.props.events) {
      if (this.props.events.length) {
        return <Icon icon="star" className="agenda__star"/>
      }
    }
    return null;
  }

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

  style = () => {
    function mergeColors(events) {
      var r = [];
      var g = [];
      var b = [];
      events.forEach((event) => {
        var color = tools.getAgendaEventColor(event.type);
        var matches = color.match(/(?:rgb\()(\d{3}), (\d{3}), (\d{3})/);
        r.push(Number(matches[1]));
        g.push(Number(matches[2]));
        b.push(Number(matches[3]));
      });
      var redValue = r.reduce((acc, cur) => {
        return acc + cur
      }, 0) / r.length;
      var greenValue = g.reduce((acc, cur) => {
        return acc + cur
      }, 0) / g.length;
      var blueValue = b.reduce((acc, cur) => {
        return acc + cur
      }, 0) / b.length;
      return `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    }
    if (this.props.events.length) {
      if (this.props.events.length > 1) {
        return {background: mergeColors(this.props.events)}
      } else {
        return {background:
          tools.getAgendaEventColor(this.props.events[0].type)}
      }
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

  pClassName = () => {
    var result = "";
    if (this.isToday()) result = "agenda__day--today";
    return result;
  }

  render() {
    return (
      <td className={this.tdClassName()} style={this.style()}>
        <button onClick={this.changeSelectedDate}>
          {this.renderIcon()}
          <p className={this.pClassName()}>
            {this.props.date.format("DD")}
          </p>
        </button>
      </td>
    )
  }
}