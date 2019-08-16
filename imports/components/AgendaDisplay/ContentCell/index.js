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
      if (event.type === "billingProducts"
          || event.type === "billingServices") {
          return (
            <li key={i} style={{cursor: "pointer"}}>
              <Link to={"/contract/" + event.referral}>
                Contrato {event.referral}: Vencimento da Cobrança de Locação {event.description}
              </Link>
            </li>
          )
          }
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