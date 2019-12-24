import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';

export default class ShippingHistory extends React.Component {

  renderHeader = () => {
    const renderButtons = (type) => {
      var history = this.props.shipping.history || [];
      var noRecords = history.length === 0;
      var hasReceivedAll = history.length === 2;
      var sendDisabled = history.length !== 0;
      var receiveDisabled = (history.length === 0 || history.length === 2);

      if (type === 'send') {
        return (
          <th className="table__small-column">
            <button
              disabled={sendDisabled}
              onClick={this.props.toggleSend}>
              <Icon icon="send" flip="horizontal" size="1x"/>
            </button>
          </th>
        )
      } else if (type === 'receive') {
        return (
          <th className="table__small-column">
            <button
              disabled={receiveDisabled}
              onClick={this.props.toggleReceive}>
              <Icon icon="receive"/>
            </button>
          </th>
        )
      }
    }

    return (
      <thead>
        <tr>
          <th className="table__small-column">#</th>
          <th>Data do Registro</th>
          <th>Tipo de Remessa</th>
          {renderButtons('send')}
          {renderButtons('receive')}
        </tr>
      </thead>
    )
  }

  renderBody = () => {
    if (!this.props.shipping.history) return null;

    function translateType(type) {
      if (type === 'send') return "Entrega";
      if (type === 'receive') return "Devolução";
      return "";
    }
    return this.props.shipping.history.map((item, i) => {
      const print = () => {
        // SOPPED HERE, NOW I NEED TO CREATE THE FUNCION INSIDE PARENT
        this.props.printDocument(item);
      }
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{moment(item.date).format("DD-MMMM-YYYY")}</td>
          <td>{translateType(item.type)}</td>
          <td>
            <button onClick={print}>
              <Icon icon="print"/>
            </button>
          </td>
        </tr>
      )
    })
  }

  renderFooter = () => {
    if (this.props.shipping.history) {
      if (this.props.shipping.history.length) return null;
    }
    return (
      <tfoot>
        <tr>
          <td colSpan="3">
            Não foram encontrados registros neste contrato
          </td>
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