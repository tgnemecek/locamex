import React from 'react';

import tools from '/imports/startup/tools/index';

export default class Table extends React.Component {
  row = () => {
    return this.props.addedItems.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="contract__item-list__value-column">{tools.format(item.price, "currency")}</td>
          <td className="table__small-column">{item.quantity}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="contract__item-list" onClick={this.props.toggleWindow}>
        {this.props.addedItems.length > 0 ?
          <div>
            <div className="contract__item-list__overlay">
              <div>✎</div>
            </div>
            <table className="table contract__item-list__table">
              <tbody>
                <tr>
                  <th>Descrição</th>
                  <th className="contract__item-list__value-column">Valor</th>
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
    )
  }
}