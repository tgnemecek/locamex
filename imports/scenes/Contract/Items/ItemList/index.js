import React from 'react';

import customTypes from '/imports/startup/custom-types';
import ProductSelection from './ProductSelection/index';

export default class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false,
      addedItems: this.props.contract[this.props.database]
    }
  }

  renderModular = (item) => {
    var str = "(";
    item.allowedModules.forEach((module, i, array) => {
      if (module.selected) {
        if (i < (array.length - 1)) {
          str += module.description + ": " + module.selected + ". ";
        } else str += module.description + ": " + module.selected;
      }
    });
    return str + ")";
  }

  toggleWindow = () => {
    var windowOpen = !this.state.windowOpen;
    this.setState({ windowOpen });
  }

  updateTable = (addedItems) => {
    this.setState({ addedItems });
  }

  row = () => {
    return this.state.addedItems.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item._id}</td>
          <td>{item.description} {item.type == 'modular' ? this.renderModular(item) : null}</td>
          <td>{customTypes.format(item.price, "currency")}</td>
          <td>{item.quantity}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="contract__list-container" onClick={this.toggleWindow}>
        {this.state.windowOpen ? <ProductSelection
                                    database={this.props.database}
                                    addedItems={this.props.contract.containers}
                                    saveEdits={this.updateTable}
                                    closeProductSelection={this.toggleWindow}/> : null}
        {this.state.addedItems.length > 0 ?
          <div>
            <div className="contract__list__overlay">
              <div>✎</div>
            </div>
            <table className="table table--contract">
              <tbody>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Qtd.</th>
                </tr>
                {this.row()}
              </tbody>
            </table>
          </div>
           :
          <div>
             <div className="contract__list__overlay">
               <div>+</div>
             </div>
             <div>
               Lista Vazia.<br/>
               Clique aqui para adicionar o primeiro item.
             </div>
          </div>
        }
        </div>
    )
  }
}