import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

export default class Database extends React.Component {

  renderDatabase = () => {
    return this.props.database.map((item, i, array) => {
      return (
        <tr key={i} className="item-list__selection__db-item">
          <td>{item.description}</td>
          <td className="buttom-column">
            <button value={item._id} onClick={this.props.addItem} className="item-list__selection__edit-button">►</button>
          </td>
        </tr>
      )
    })
  }

  render() {
      return (
        <div className="item-list__selection__database">
          <div className="item-list__selection__scroll-block">
            <table className="table item-list__selection__table">
              <thead>
                <tr>
                  <th>Descrição</th>
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