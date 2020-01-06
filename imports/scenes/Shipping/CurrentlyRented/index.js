import React from 'react';
import moment from 'moment';
import { saveAs } from 'file-saver';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class CurrentlyRented extends React.Component {
  renderBody = () => {
    var all = [].concat(
      this.props.currentlyRented.fixed.map((item) => {
        return {...item, type: "fixed"}
      }),
      this.props.currentlyRented.accessories.map((item) => {
        return {...item, type: "accessory"}
      }),
      this.props.currentlyRented.modules.map((item) => {
        return {...item, type: "module"}
      })
    )
    return all.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{item.renting || 1}</td>
          <td>{item.type === "fixed" ? item.description + " (Série: " + item.seriesId + ")" : item.description}</td>
          <td className="table__small-column">
            {item.type === "fixed" ?
              <button>
                <Icon icon="transaction"/>
              </button>
            : null}
          </td>
        </tr>
      )
    });
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="table__small-column">#</th>
            <th className="table__small-column">Qtd.</th>
            <th>Itens</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    )
  }
}