import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class Rented extends React.Component {

  count = () => {
    return this.props.item.units.reduce((acc, cur) => {
      return acc + (cur.place === 'rented' && cur.visible);
    }, 0)
  }

  renderBody = () => {
    return this.props.item.units.map((item, i) => {
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      if (item.visible && item.place === 'rented') {
        return (
          <tr key={i}>
            <td className="stock-visualizer__fixed__serial">{item.serial}</td>
            <td>{item.observations}</td>
            <td className="table__small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
          </tr>
        )
      }
    })
  }

  render() {
    if (this.count() === 0) return null;
    return (
      <Block
        title={`Locados: ${this.count()}`}
        style={{maxHeight: "300px", overflowY: "auto"}}
        columns={1}>
        <table className="table database__table">
          <thead>
            <tr>
              <th className="stock-visualizer__fixed__serial">Série</th>
              <th>Observação</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
      </Block>
    )
  }
}