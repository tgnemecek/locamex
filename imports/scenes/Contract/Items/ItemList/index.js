import React from 'react';

import tools from '/imports/startup/tools/index';
import ProductSelection from './ProductSelection/index';

export default class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false
    }
  }

  renderDescripton = (item) => {
    if (item.type === 'fixed' || this.props.database === 'accessories' || this.props.database === 'services'){
      return <td>{item.description}</td>
    } else if (item.type === 'modular' || item.type === 'pack') {
      var suffix = "(";
      item.modules.forEach((module, i, array) => {
        if (module.selected) {
          if (i < (array.length - 1)) {
            suffix += module.description + ": " + module.selected + ". ";
          } else suffix += module.description + ": " + module.selected;
        }
      });
      suffix = suffix + ")";
      return <td>{item.description} {suffix}</td>
    }
  }

  toggleWindow = () => {
    var windowOpen = !this.state.windowOpen;
    this.setState({ windowOpen });
  }

  updateTable = (addedItems) => {
    this.props.updateContract([addedItems, []], [this.props.database, "billing"]);
  }

  row = () => {
    return this.props.contract[this.props.database].map((item, i) => {
      return (
        <tr key={i}>
          <td className="small-column">{item.serial || "-"}</td>
          {this.renderDescripton(item)}
          <td className="small-column">{tools.format(item.price, "currency")}</td>
          <td className="small-column">{item.quantity}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <>
      {this.state.windowOpen ? <ProductSelection
                                  database={this.props.database}
                                  addedItems={this.props.contract[this.props.database]}
                                  saveEdits={this.updateTable}
                                  closeProductSelection={this.toggleWindow}/> : null}
      <div className="contract__item-list" onClick={this.toggleWindow}>
        {this.props.contract[this.props.database].length > 0 ?
          <div>
            <div className="contract__item-list__overlay">
              <div>✎</div>
            </div>
            <table className="table contract__item-list__table">
              <tbody>
                <tr>
                  <th className="small-column">Série</th>
                  <th>Descrição</th>
                  <th className="small-column">Valor</th>
                  <th className="small-column">Qtd.</th>
                </tr>
                {this.row()}
              </tbody>
            </table>
          </div>
           :
          <div>
             <div className="contract__item-list__overlay">
               <div>+</div>
             </div>
             <div>
               Lista Vazia.<br/>
               Clique aqui para adicionar o primeiro item.
             </div>
          </div>
        }
        </div>
      </>

    )
  }
}