import React from 'react';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

export default class ContentDisplay extends React.Component {
  colorBox = (type) => {
    return (
      <div className="agenda__color-box"
        style={{background: tools.getAgendaEventColor(type)}}/>
    )
  }
  renderEvents = () => {
    if (!this.props.events) {
      return <p>Nenhum evento marcado</p>
    } else {
      return this.props.events.map((event, i) => {
        var description = "";
        var link = "";
        if (event.type === "billingProducts") {
          description = `Contrato ${event.referral}: Vencimento da Cobrança de Locação ${event.description}`;
          link = "/billing/" + event.referral;
        } else if (event.type === "billingServices") {
          description = `Contrato ${event.referral}: Vencimento da Cobrança de Serviço ${event.description}`;
          link = "/billing/" + event.referral;
        } else if (event.type === "deliveryDate") {
          description = `Contrato ${event.referral}: Entrega de Produtos`;
          link = "/shipping/" + event.referral;
        }

        return (
          <div key={i} className="agenda__referral-link">
            {this.colorBox(event.type)}
            <div>
              <Link to={link}>{description}</Link>
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