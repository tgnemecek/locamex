import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

export default class AddedItems extends React.Component {
  renderAddedItems = () => {
    return this.props.addedItems.map((item, i, array) => {
      return (
        <tr key={i} className="manage-items__selection__db-item">
          <td>{item.description}</td>
          <td className="medium-column">
            <Input
              type="currency"
              name={item._id}
              value={item.price}
              allowNegative={this.props.type === 'services'}
              onChange={this.props.changePrice}/>
          </td>
          <td className="table__small-column">
            <Input
              type="number"
              name={item._id}
              style={{width: "40px"}}
              value={item.renting || 1}
              min={1}
              onChange={this.props.changeQuantity}/>
          </td>
          <td className="buttom-column">
            <button onClick={() => this.props.removeItem(i)}>
              <Icon icon="not" />
            </button>
          </td>
        </tr>
      )
    })
  }

  render() {
      return (
        <div className="manage-items__selection__added-items">
          <div className="manage-items__selection__scroll-block">
            <table className="table manage-items__selection__table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th className="medium-column">Valor</th>
                  <th className="table__small-column">Qtd.</th>
                  <th className="buttom-column" style={{visibility: "hidden"}}>✖</th>
                </tr>
              </thead>
              <tbody>
                {this.renderAddedItems()}
              </tbody>
            </table>
          </div>
        </div>
      )
  }
}