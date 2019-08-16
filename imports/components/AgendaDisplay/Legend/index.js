import React from 'react';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Icon from '/imports/components/Icon/index';

export default class Legend extends React.Component {
  renderLegend = () => {
    var types = [];
    this.props.agendaDatabase.forEach((event) => {
      if (!types.includes(event.type)) {
        types.push(event.type);
      }
    })
    return types.map((type, i) => {
      return (
        <div className="agenda__legend-unit" key={i}>
          <div
            className="agenda__color-box"
            style={{background: tools.getAgendaEventColor(type)}}/>
            <div>{tools.translateAgendaEvent(type)}</div>
        </div>
      )
    })
  }
  render() {
    return (
      <div>
        <div className="agenda__legend">
          {this.renderLegend()}
        </div>
      </div>
    )
  }
}