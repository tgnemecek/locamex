import React from 'react';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

export default class ContentDisplay extends React.Component {
  renderEvents = () => {
    if (!this.props.events) {
      return <p>Nenhum evento marcado</p>
    } else {
      return this.props.events.map((event, i) => {
        var link = "";
        var category;
        if (event.type === "billing") {
          link = "/billing/" + event.referral;
          category = event.status;
        }
        return (
          <div key={i} className="agenda__referral-link">
            <this.props.ColorBox type={category}/>
            <div>
              <Link to={link}>
                <this.props.Status status={category} prefix={event.description}/>
              </Link>
            </div>
          </div>
        )
      })
    }
  }
  render() {
    return (
      <div className="agenda__content-display">
        <h3>Eventos do dia: {this.props.selectedDate.format("DD-MM-YYYY")}</h3>
        {this.props.events.length
        ? this.renderEvents()
        : <p>Nenhum evento marcado</p>}
      </div>
    )
  }
}