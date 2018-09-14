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

  renderAddedItems = () => {
    return this.props.addedItems.map((item, i, array) => {
      return (
        <tr key={i} className="product-selection__db-item">
          <td>{item._id}</td>
          <td>{item.description}</td>
          <td><Input type="currency" name={i} value={item.price} onChange={this.props.changePrice}/></td>
          {this.props.database != 'containers' ?
            <td>
              <Input
                type="number"
                name={i}
                value={item.quantity}
                max={item.available}
                onChange={this.props.changeQuantity}/>
            </td> : null
          }
          <td>{item.type == 'modular' ?
            <button name="addedItems" value={i} className="product-selection__edit-button" onClick={this.props.toggleModularScreen}>✎</button>
            :
            <button value={item._id} className="button--table-x" onClick={this.props.removeItem}>✖</button>
            }</td>
        </tr>
      )
    })
  }

  render() {
    var className = "table table--added-items--5rows";
    if (this.props.database == 'containers') className = "table table--added-items--4rows";
      return (
        <div className="added-items">
          <label>Itens Adicionados no Contrato:</label>
          <table className={className}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Valor</th>
                {this.props.database != 'containers' ? <th>Qtd.</th> : null}
                <th style={{visibility: "hidden"}}>✖</th>
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