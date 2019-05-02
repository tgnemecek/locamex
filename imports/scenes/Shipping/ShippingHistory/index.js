import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';

export default class ShippingHistory extends React.Component {

  renderHeader = () => {
    return (
      <thead>
        <tr>
          <th>#</th>
          <th>Data do Registro</th>
          <th>Tipo de Envio</th>
          <th><button onClick={this.props.toggleNewShipping} className="database__table__button">+</button></th>
        </tr>
      </thead>
    )
  }

  renderBody = () => {
    return this.props.shipping.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{moment(item.date).format("DD-MMMM-YYYY")}</td>
          <td>{item.type}</td>
          <td>botão</td>
        </tr>
      )
    })
  }

  renderFooter = () => {
    if (this.props.shipping.length) {
      return null;
    } else return (
      <tfoot>
        <tr>
          <td colSpan="3">Não foram encontrados registros neste contrato</td>
        </tr>
      </tfoot>
    )
  }

  render() {
    return (
      <table className="table">
        {this.renderHeader()}
        <tbody>
          {this.renderBody()}
        </tbody>
        {this.renderFooter()}
      </table>
    )
  }
}