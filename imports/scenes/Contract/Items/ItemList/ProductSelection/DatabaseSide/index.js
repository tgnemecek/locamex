import { Meteor } from 'meteor/meteor';
import React from 'react';

import customTypes from '/imports/startup/custom-types';
import SearchBar from '/imports/components/SearchBar/index';

export default class DatabaseSide extends React.Component {

  renderDatabase = () => {
    return this.props.database.map((item, i, array) => {
      if (!item.added) {
        return (
          <tr key={i} className="product-selection__db-item">
            <td>{item._id}</td>
            <td>{item.description}</td>
            {this.props.database != 'accessories' ? null : <td>{item.available}/{item.total}</td>}
            <td><button
              name="database"
              value={i}
              onClick={item.type !== 'modular' ? this.props.addItem : this.props.toggleModularScreen}>
              ►
            </button></td>
          </tr>
        )
      }
    })
  }

  render() {
      return (
        <div className="product-selection__database">
          <SearchBar
            hiddenOption="description"
            database={this.props.fullDatabase}
            searchReturn={this.props.searchReturn}/>
          <table className="table table--product-selection--database">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                {this.props.database != 'accessories' ? null : <th>Disp.</th>}
                <th style={{visibility: "hidden"}}></th>
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