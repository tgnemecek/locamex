import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import SearchBar from '/imports/components/SearchBar/index';

export default class DatabaseSide extends React.Component {

  renderDatabase = () => {
    return this.props.database.map((item, i, array) => {
      var buttonProps = {
        name: "database",
        value: item._id,
        className: "product-selection__edit-button"
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
          <tr key={i} className="product-selection__db-item">
            <td className="small-column">{item.serial || "-"}</td>
            <td>{item.description + this.packSuffix(item.type)}</td>
            {this.props.databaseType != 'accessories' ? null : <td className="small-column">{item.available}</td>}
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
        <div className="product-selection__database">
          <SearchBar
            hiddenOption="description"
            database={this.props.fullDatabase}
            searchReturn={this.props.searchReturn}/>
          <table className="table product-selection__table">
            <thead>
              <tr>
                <th className="small-column">Série</th>
                <th>Descrição</th>
                {this.props.databaseType != 'accessories' ? null : <th className="small-column">Disp.</th>}
                <th className="buttom-column" style={{visibility: "hidden"}}></th>
              </tr>
            </thead>
            <tbody>
              {this.renderDatabase()}
            </tbody>
          </table>
        </div>
      )
  }
}