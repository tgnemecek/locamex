import React from 'react';
import { Link } from 'react-router-dom';
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

  render() {
    return (
      <td className={this.props.className}>
        {this.renderIcon()}
        <p className={this.props.isToday ? "agenda__day--today" : ""}>
          {this.props.date.format("DD")}
        </p>
        <HoverWindow
          events={this.props.events}
        />
      </td>
    )
  }
}

function HoverWindow(props) {
  renderEvents = () => {
    return props.events.map((event, i) => {
      return (
        <li key={i}>
          <Link to={"/" + event.link}>Contrato 2019-0100: Vencimento da Cobrança 5/10</Link>
        </li>
      )
    })
  }
  return (
    <div className="agenda__hoverbox">
      <h4>Eventos:</h4>
      <ul>
        {renderEvents()}
      </ul>
    </div>
  )
}