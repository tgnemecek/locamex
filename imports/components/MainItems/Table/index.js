import React from 'react';

import tools from '/imports/startup/tools/index';

export default class Table extends React.Component {
  row = () => {
    return this.props.addedItems.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__wide">{item.description}</td>
          <td className="main-items__list__value-column">
            {tools.format(item.price, "currency")}
          </td>
          <td>{item.renting}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className={!this.props.disabled ? "main-items__list" : "main-items__list disable-click"} onClick={this.props.toggleWindow}>
        {this.props.addedItems.length > 0 ?
          <div>
            <div className="main-items__list__overlay">
              <div>✎</div>
            </div>
            <table className="table main-items__list__table">
              <tbody>
                <tr>
                  <th className="table__wide">Descrição</th>
                  <th className="main-items__list__value-column">
                    Valor
                  </th>
                  <th>Qtd.</th>
                </tr>
                {this.row()}
              </tbody>
            </table>
          </div>
           :
          <div>
             <div className="main-items__list__overlay">
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