import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

export default class Database extends React.Component {

  renderDatabase = () => {
    return this.props.database.map((item, i, array) => {
      var buttonProps = {
        name: "database",
        value: item._id,
        className: "item-list__selection__edit-button"
      };
      if (item.type === 'fixed' || this.props.databaseType === 'accessories' || this.props.databaseType === 'services') {
        buttonProps.onClick = this.props.addItem;
      } else if (item.type === 'modular') {
        buttonProps.onClick = this.props.toggleModularScreen;
      } else if (item.type === 'pack') {
        buttonProps.onClick = this.props.togglePackScreen;
      }

      if (!item.added && item.available != 0) {
        return (
          <tr key={i} className="item-list__selection__db-item">
            <td className="table__small-column">{item.serial || "-"}</td>
            <td>{item.description + this.packSuffix(item.type)}</td>
            {this.props.databaseType !== 'containers' ? null : <th className="table__small-column">{item.place || '-'}</th>}
            {this.props.databaseType !== 'accessories' ? null : <td className="table__small-column">{item.available}</td>}
            <td className="buttom-column"><button { ...buttonProps }>►</button></td>
          </tr>
        )
      }
    })
  }

  packSuffix = (type) => {
    if (type === 'pack') {
      return "* (Pacote Montado)"
    } else return '';
  }

  render() {
      return (
        <div className="item-list__selection__database">
          <div className="item-list__selection__scroll-block">
            <table className="table item-list__selection__table">
              <thead>
                <tr>
                  <th className="table__small-column">Série</th>
                  <th>Descrição</th>
                  {this.props.databaseType !== 'containers' ? null : <th className="table__small-column">Pátio</th>}
                  {this.props.databaseType !== 'accessories' ? null : <th className="table__small-column">Disp.</th>}
                  <th className="buttom-column" style={{visibility: "hidden"}}></th>
                </tr>
              </thead>
              <tbody>
                {this.renderDatabase()}
              </tbody>
            </table>
          </div>
        </div>
      )
  }
}