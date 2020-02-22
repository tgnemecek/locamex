import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import RegisterData from '/imports/components/RegisterData/index';

export default class BillingHistory extends React.Component {
  renderStatus = (status, type) => {
    var obj = this.props.translateBillStatus(status, type);
    return (
      <span className={obj.className}>
        {obj.text}
      </span>
    )
  }

  renderProductsBody = () => {
    return this.props.snapshot.billingProducts.map(
      (bill, i, arr) => {

      const toggleBox = () => {
        this.props.toggleWindow({
          ...bill,
          index: i,
          length: arr.length
        });
      }

      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{bill.account.description}</td>
          <td className="table__small-column">
            {moment(bill.startDate).format("DD/MM/YYYY") + " a " +
            moment(bill.endDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {moment(bill.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {tools.format(bill.value, 'currency')}
          </td>
          <td className="table__small-column">
            {tools.format(bill.valuePayed || 0, 'currency')}
          </td>
          <td className="table__small-column">{bill._id || "-"}</td>
          <td className="table__small-column">
            {this.renderStatus(bill.status, 'billingProducts')}
          </td>
          {status !== "notReady" ?
            <td className="table__small-column table__td-button">
              <button onClick={toggleBox}>
                <Icon icon="money"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  renderProrogationBody = () => {
    return this.props.snapshot.billingProrogation.map((bill, i, arr) => {
      const toggleBox = () => {
        this.props.toggleWindow({
          ...bill,
          index: i,
          length: arr.length
        });
      }
      return (
        <tr key={i}>
          <td className="table__small-column">{"PRO #" + (i+1)}</td>
          <td>{bill.account.description}</td>
          <td className="table__small-column">
            {moment(bill.startDate).format("DD/MM/YYYY") + " a " +
            moment(bill.endDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {moment(bill.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {tools.format(bill.value, 'currency')}
          </td>
          <td className="table__small-column">
            {tools.format(bill.valuePayed || 0, 'currency')}
          </td>
          <td className="table__small-column">{bill._id || "-"}</td>
          <td className="table__small-column">
            {this.renderStatus(bill.status, 'billingProducts')}
          </td>
          {status !== "notReady" ?
            <td className="table__small-column table__td-button">
              <button onClick={toggleBox}>
                <Icon icon="money"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  renderServicesBody = () => {
    return this.props.snapshot.billingServices.map((bill, i, arr) => {

      const toggleBox = () => {
        this.props.toggleWindow({
          ...bill,
          index: i,
          length: arr.length
        });
      }

      return (
        <tr key={i}>
          <td className="table__small-column">{(i+1) + "/" + arr.length}</td>
          <td>{bill.account.description}</td>
          <td className="table__small-column">
            {moment(bill.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td className="table__small-column">
            {tools.format(bill.value, 'currency')}
          </td>
          <td className="table__small-column">
            {tools.format(bill.valuePayed || 0, 'currency')}
          </td>
          <td className="table__small-column">
            {this.renderStatus(bill.status, 'billingServices')}
          </td>
          {bill.status === "ready" || bill.status === "late" || bill.status === "billed" ?
            <td className="table__small-column table__td-button">
              <button onClick={toggleBox}>
                <Icon icon="money"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <h3>Histórico de Faturas</h3>
        <h4>Cobranças de Locação</h4>
        <table className="table">
          <thead>
            <tr>
              <th className="table__small-column">#</th>
              <th>Conta</th>
              <th className="table__small-column">Período</th>
              <th className="table__small-column">Vencimento</th>
              <th className="table__small-column">Valor Base</th>
              <th className="table__small-column">Valor Pago</th>
              <th className="table__small-column">Número da Fatura</th>
              <th className="table__small-column">Status</th>
            </tr>
          </thead>
          <tbody>
            {this.renderProductsBody()}
            {this.renderProrogationBody()}
          </tbody>
        </table>
        <h4>Cobranças de Serviço</h4>
        <table className="table">
          <thead>
            <tr>
              <th className="table__small-column">#</th>
              <th>Conta</th>
              <th className="table__small-column">Vencimento</th>
              <th className="table__small-column">Valor Base</th>
              <th className="table__small-column">Valor Pago</th>
              <th className="table__small-column">Status</th>
            </tr>
          </thead>
          <tbody>
            {this.renderServicesBody()}
          </tbody>
        </table>
      </div>
    )
  }
}