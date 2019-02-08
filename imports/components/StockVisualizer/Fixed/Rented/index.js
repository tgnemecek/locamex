import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class Rented extends React.Component {

  renderBody = () => {
    return this.props.item.units.map((item) => {
      return (
        <tr>
          <td>{item.serial}</td>
          <td>{item.observations}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
        </tr>
      )
    })
  }

  render() {
    if (!this.props.item.units.length) return null;
    return (
      <table className="table database__table">
        <thead>
          <tr>
            <th>Série</th>
            <th>Observação</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    )
  }
}