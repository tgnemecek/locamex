import React from 'react';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Icon from '/imports/components/Icon/index';

export default class Legend extends React.Component {
  renderLegend = () => {
    var legends = [];
    var exceptions = []; // Add exceptions here
    this.props.agendaDatabase.forEach((event) => {
      if (event.type === "billing") {
        if (!exceptions.includes(event.status)) {
          if (!legends.includes(event.status)) {
            legends.push(event.status);
          }
        }
      }
    })
    return legends.map((legend, i) => {
      return (
        <div className="agenda__legend-unit" key={i}>
          <this.props.ColorBox type={legend}/>
            <div><this.props.Status status={legend}/></div>
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