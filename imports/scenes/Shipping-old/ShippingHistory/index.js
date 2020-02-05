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
    return (
      <thead>
        <tr>
          <th className="table__small-column">#</th>
          <th>Data do Registro</th>
          <th>Tipo de Remessa</th>
          <th>Itens</th>
        </tr>
      </thead>
    )
  }

  printDocument = (index) => {
    var item = this.props.contract.shipping[index];
    item.list = this.props.prepareList(item, true);
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
    if (!this.props.contract.shipping) return null;
    function translateType(type) {
      if (type === 'send') return "Envio";
      if (type === 'receive') return "Recebimento";
      return "";
    }
    function extras(item) {
      var series = item.series ? "Série: " + item.series : "";
      var place = item.place ? "Pátio: " + item.place : "";
      var variation = item.variation || "";
      var label = item.label ? "Etiqueta " + item.label : "";
      var array = [series, place, variation, label];
      array = array.filter((str) => str);
      if (array.length) {
        return "(" + array.join(" - ") + ")";
      } else return "";
    }
    const renderList = (item) => {
      var list = this.props.prepareList(item, true);
      return list.map((item, i) => {
        return (
          <li key={i}>
            {`${item.quantity}x ${item.description} ${extras(item)}`}
            {item.subList ?
              <ul>
                {item.subList.map((subItem, i) => {
                  return (
                    <li key={i}>
                      {`${subItem.quantity}x ${subItem.description} ${extras(subItem)}`}
                    </li>
                  )
                })}
              </ul>
            : null}
          </li>
        )
      })
    }
    var shipping = tools.deepCopy(this.props.contract.shipping);
    shipping.reverse();
    return shipping.map((item, i, arr) => {
      return (
        <tr key={i}>
          <td>{arr.length - i}</td>
          <td>{moment(item.date).format("DD-MMMM-YYYY HH:MM")}</td>
          <td>{translateType(item.type)}</td>
          <td>
            <ul>
              {renderList(item)}
            </ul>
        </td>
          <td className="table__small-column">
            <button onClick={() => this.printDocument(arr.length - i - 1)}>
              <Icon icon="print"/>
            </button>
          </td>
        </tr>
      )
    })
  }

  renderFooter = () => {
    if (this.props.contract.shipping) {
      if (this.props.contract.shipping.length) return null;
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