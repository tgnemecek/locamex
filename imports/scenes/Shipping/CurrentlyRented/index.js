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
    function description(item, accessoriesDatabase) {
      if (item.type === "fixed") {
        return item.description + " (Série: " + item.seriesId + ")"
      } else if (item.type === "accessory") {
        var variations = "";
        var found = accessoriesDatabase.find((obj) => {
          return obj._id === item.productId;
        });
        if (found) {
          if (found.variations.length > 1) {
            variations = " (Padrão: " + tools.convertToLetter(item.variationIndex) + ")"
          } else {
            variations = " (Padrão Único)"
          }
        }
        return item.description + variations;
      } else return item.description;
    }
    return all.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.selected || 1}</td>
          <td>{description(item, this.props.accessoriesDatabase)}</td>
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
    if (!this.props.currentlyRented.fixed.length &&
        !this.props.currentlyRented.accessories.length &&
        !this.props.currentlyRented.modules.length) {
      return (
        <p style={{fontStyle: "italic", textAlign: "center"}}>
          Não há itens atualmente no cliente.
        </p>
      )
    }
    return (
      <table className="table">
        <thead>
          <tr>
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