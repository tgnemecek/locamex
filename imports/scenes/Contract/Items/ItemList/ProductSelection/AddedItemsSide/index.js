import { Meteor } from 'meteor/meteor';
import React from 'react';

import customTypes from '/imports/startup/custom-types';
import CustomInput from '/imports/components/CustomInput/index';


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
          <td><CustomInput type="currency" name={i} value={item.price * 100} onChange={this.props.changePrice}/></td>
          {this.props.database != 'containers' ?
            <td>
              <CustomInput
                type="number"
                name={i}
                value={item.quantity}
                max={item.available}
                onChange={this.props.changeQuantity}/>
            </td> : null
          }
          <td>{item.type !== 'modular' ?
            <button value={item._id} className="button--table-x" onClick={this.props.removeItem}>✖</button>
            :
            <button name="addedItems" value={i} className="button--table-edit" onClick={this.props.toggleModularScreen}>✎</button>
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