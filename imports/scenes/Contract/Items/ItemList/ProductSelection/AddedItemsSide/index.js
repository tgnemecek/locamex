import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';


export default class AddedItemsSide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleDatabase: [],
      moduleObj: ''
    }
  }

  packSuffix = (type) => {
    if (type === 'pack') {
      return "* (Pacote Montado)"
    } else return '';
  }

  renderAddedItems = () => {
    return this.props.addedItems.map((item, i, array) => {
      var buttonProps = {
        name: "addedItems",
        value: item._id,
        className: "product-selection__edit-button"
      };
      var buttonIcon = "✎";
      if (item.type === 'fixed' || this.props.databaseType === 'accessories' || this.props.databaseType === 'services') {
        buttonIcon = "✖";
        buttonProps.onClick = this.props.removeItem;
        buttonProps.className = "button--table-x";
      } else if (item.type === 'modular') {
        buttonProps.onClick = this.props.toggleModularScreen;
      } else if (item.type === 'pack') {
        buttonProps.onClick = this.props.togglePackScreen;
      }

      return (
        <tr key={i} className="product-selection__db-item">
          <td className="small-column">{item.serial || "-"}</td>
          <td>{item.description + this.packSuffix(item.type)}</td>
          <td className="medium-column"><Input type="currency" name={i} value={item.price} onChange={this.props.changePrice}/></td>
          <td className="small-column">
            <Input
              type="number"
              name={i}
              style={{width: "40px"}}
              readOnly={item.type == 'fixed' || item.type == 'pack'}
              value={item.quantity || 1}
              max={item.available || item.type == 'pack'}
              onChange={this.props.changeQuantity}/>
          </td>
          <td className="buttom-column"><button {... buttonProps }>{buttonIcon}</button></td>
        </tr>
      )
    })
  }

  render() {
      return (
        <div className="product-selection__added-items">
          <label>Itens Adicionados no Contrato:</label>
          <table className="table product-selection__table">
            <thead>
              <tr>
                <th className="small-column">Série</th>
                <th>Descrição</th>
                <th className="medium-column">Valor</th>
                <th className="small-column">Qtd.</th>
                <th className="buttom-column" style={{visibility: "hidden"}}>✖</th>
              </tr>
            </thead>
            <tbody>
              {this.renderAddedItems()}
            </tbody>
          </table>
        </div>
      )
  }
}