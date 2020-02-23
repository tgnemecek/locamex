import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

export default class ContentDisplay extends React.Component {
  renderEvents = () => {
    var filtered = this.props.events.filter((event) => {
      return moment(event.date).isSame(this.props.selectedDate, 'day');
    })
    if (!filtered.length) return <p>Nenhum evento marcado</p>

    return filtered.map((event, i) => {
      return (
        <div key={i} className="agenda__referral-link">
          <this.props.ColorBox {...event}/>
          <div>
            <Link to={event.link}>
              {event.description}
            </Link>
          </div>
        </div>
      )
    })
  }
  render() {
    return (
      <div className="agenda__content-display">
        <h3>Eventos do dia: {this.props.selectedDate.format("DD-MM-YYYY")}</h3>
        {this.renderEvents()}
      </div>
    )
  }
}