import React from 'react';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';

export default class Legend extends React.Component {
  renderLegend = () => {
    var uniques = [];
    var filteredEvents = [];
    this.props.eventsDatabase.forEach((event) => {
      if (!uniques.includes(event.legend)) {
        uniques.push(event.legend);
        filteredEvents.push(event);
      }
    })
    return filteredEvents.map((event, i) => {
      return (
        <div className="agenda__legend-unit" key={i}>
          <this.props.ColorBox {...event}/>
            <div>{event.legend}</div>
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