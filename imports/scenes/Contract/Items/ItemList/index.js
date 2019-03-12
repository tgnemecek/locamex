import React from 'react';

import tools from '/imports/startup/tools/index';
import ServicesSelection from './ServicesSelection/index';
import AccessoriesSelection from './AccessoriesSelection/index';

export default class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false
    }
  }

  renderDescripton = (item) => {
    if (item.type === 'fixed' || this.props.dbName === 'accessories' || this.props.dbName === 'services'){
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
    this.props.updateContract({
      [this.props.dbName]: addedItems,
      billingProducts: [],
      billingServices: []
    });
  }

  row = () => {
    return this.props.contract[this.props.dbName].map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__small-column">{item.serial || "-"}</td>
          {this.renderDescripton(item)}
          <td className="table__small-column">{tools.format(item.price, "currency")}</td>
          <td className="table__small-column">{item.quantity}</td>
        </tr>
      )
    })
  }

  render() {
    var Selection;
    if (this.props.dbName === 'containers') {
      Selection = AccessoriesSelection; // MUDAR!!!!
    } else if (this.props.dbName === 'accessories') {
      Selection = AccessoriesSelection;
    } else if (this.props.dbName === 'services') {
      Selection = ServicesSelection;
    }
    return (
      <>
      {this.state.windowOpen ?
        <Selection
          addedItems={this.props.contract.accessories}
          saveEdits={this.updateTable}
          closeWindow={this.toggleWindow}/> : null}
      <div className="contract__item-list" onClick={this.toggleWindow}>
        {this.props.contract[this.props.dbName].length > 0 ?
          <div>
            <div className="contract__item-list__overlay">
              <div>✎</div>
            </div>
            <table className="table contract__item-list__table">
              <tbody>
                <tr>
                  <th className="table__small-column">Série</th>
                  <th>Descrição</th>
                  <th className="table__small-column">Valor</th>
                  <th className="table__small-column">Qtd.</th>
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