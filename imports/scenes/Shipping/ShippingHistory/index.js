import React from 'react';
import moment from 'moment';
import { saveAs } from 'file-saver';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class ShippingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: ''
    }
  }

  renderHeader = () => {
    const renderButtons = (type) => {
      var shipping = this.props.shipping || [];
      var noRecords = shipping.length === 0;
      var hasReceivedAll = shipping.length === 2;
      var sendDisabled = shipping.length !== 0;
      var receiveDisabled = (shipping.length === 0 || shipping.length === 2);

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
          <th>Itens</th>
          {renderButtons('send')}
          {renderButtons('receive')}
        </tr>
      </thead>
    )
  }

  printDocument = (index) => {
    var item = this.props.shipping[index];
    item.list = prepareList(item);
    item.contractId = this.props.contract._id;
    item.index = index;

    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('pdf.generate', item, (err, res) => {
        if (res) {
          saveAs(res.data, res.fileName);
          this.setState({ databaseStatus: "completed" });
        }
        if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      })
    })
  }

  renderBody = () => {
    if (!this.props.shipping) return null;
    function translateType(type) {
      if (type === 'send') return "Entrega";
      if (type === 'receive') return "Devolução";
      return "";
    }
    function renderList(item) {
      var list = prepareList(item);
      return list.map((item, i) => {
        return (
          <li key={i}>
            {`${item.quantity}x ${item.description}`}
          </li>
        )
      })
    }
    return this.props.shipping.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{moment(item.date).format("DD-MMMM-YYYY")}</td>
          <td>{translateType(item.type)}</td>
          <td>
            <ul>
              {renderList(item)}
            </ul>
        </td>
          <td>
            <button onClick={() => this.printDocument(i)}>
              <Icon icon="print"/>
            </button>
          </td>
        </tr>
      )
    })
  }

  renderFooter = () => {
    if (this.props.shipping) {
      if (this.props.shipping.length) return null;
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
      <>
        <table className="table">
          {this.renderHeader()}
          <tbody>
            {this.renderBody()}
          </tbody>
          {this.renderFooter()}
        </table>
        <DatabaseStatus status={this.state.databaseStatus}/>
      </>

    )
  }
}

function prepareList(item) {
  var fixed = item.fixed ? item.fixed.map((item) => {
    return {
      quantity: 1,
      description: `${item.description} (Série: ${item.seriesId})`
    }
  }) : null;
  var accessories = item.accessories ? item.accessories.map((item) => {
    return {
      quantity: item.renting,
      description: item.description
    }
  }) : null;
  var modules = item.modules ? item.modules.map((item) => {
    return {
      quantity: item.selected.reduce((acc, cur) => {
        return acc + cur.selected;
      }, 0),
      description: item.description
    }
  }) : null;
  return fixed.concat(accessories, modules);
}