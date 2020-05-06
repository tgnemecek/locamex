import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

export default class AddedItems extends React.Component {
  render() {
      return (
        <div className="manage-items__wrapper">
          <table className="table manage-items__table">
            <thead>
              <tr>
                <th className="table__wide">
                  Descrição
                </th>
                <th>Valor</th>
                <th>Qtd.</th>
              </tr>
            </thead>
            <tbody>
              {this.props.addedItems.map((item, i, array) => {
                return (
                  <tr key={i}>
                    <td className="table__wide">
                      {item.description}
                    </td>
                    <td className="no-padding">
                      <Input
                        type="currency"
                        style={{width: "100px"}}
                        name={item._id}
                        value={item.price}
                        allowNegative={this.props.type === 'services'}
                        onChange={this.props.changePrice}/>
                    </td>
                    <td className="no-padding">
                      <Input
                        type="number"
                        style={{width: "45px"}}
                        name={item._id}
                        value={item.quantity || 1}
                        min={1}
                        onChange={this.props.changeQuantity}/>
                    </td>
                    <td className="no-padding">
                      <button onClick={() => this.props.removeItem(i)}>
                        <Icon icon="not" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
  }
}