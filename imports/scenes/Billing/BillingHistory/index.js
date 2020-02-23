import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import RegisterData from '/imports/components/RegisterData/index';

export default class BillingHistory extends React.Component {
  renderStatus = (status, type) => {
    var obj = tools.translateBillStatus(status, type);
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
          <td>{(i+1) + "/" + arr.length}</td>
          <td>{bill._id || "-"}</td>
          <td className="billing-history__account-cell">
            {bill.account.description}
          </td>
          <td>
            {moment(bill.startDate).format("DD/MM/YYYY") + " a " +
            moment(bill.endDate).format("DD/MM/YYYY")}
          </td>
          <td>
            {moment(bill.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td>
            {tools.format(bill.value, 'currency')}
          </td>
          <td>
            {tools.format(bill.valuePayed || 0, 'currency')}
          </td>
          <td className="billing-history__status-cell">
            {this.renderStatus(bill.status, 'billingProducts')}
          </td>
          {status !== "notReady" ?
            <td className="no-padding billing-history__button-cell">
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
          <td>{"PRO #" + (i+1)}</td>
          <td>{bill._id || "-"}</td>
          <td className="billing-history__account-cell">
            {bill.account.description}
          </td>
          <td>
            {moment(bill.startDate).format("DD/MM/YYYY") + " a " +
            moment(bill.endDate).format("DD/MM/YYYY")}
          </td>
          <td>
            {moment(bill.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td>
            {tools.format(bill.value, 'currency')}
          </td>
          <td>
            {tools.format(bill.valuePayed || 0, 'currency')}
          </td>
          <td className="billing-history__status-cell">
            {this.renderStatus(bill.status, 'billingProducts')}
          </td>
          {status !== "notReady" ?
            <td className="no-padding billing-history__button-cell">
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
          <td>{(i+1) + "/" + arr.length}</td>
          <td>
            {bill.account.description}
          </td>
          <td>
            {moment(bill.expiryDate).format("DD/MM/YYYY")}
          </td>
          <td>
            {tools.format(bill.value, 'currency')}
          </td>
          <td>
            {tools.format(bill.valuePayed || 0, 'currency')}
          </td>
          <td className="billing-history__status-cell">
            {this.renderStatus(bill.status, 'billingServices')}
          </td>
          <td className="no-padding billing-history__button-cell">
            <button onClick={toggleBox}>
              <Icon icon="money"/>
            </button>
          </td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <h3>Histórico de Faturas</h3>
        <h4>Cobranças de Locação</h4>
        <table className="table billing-history__table-products">
          <thead>
            <tr>
              <th>#</th>
              <th>Fatura</th>
              <th className="billing-history__account-cell">Conta</th>
              <th>Período</th>
              <th>Vencimento</th>
              <th>Valor Base</th>
              <th>Valor Pago</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.renderProductsBody()}
            {this.renderProrogationBody()}
          </tbody>
        </table>
        <h4>Cobranças de Serviço</h4>
        <table className="table billing-history__table-services">
          <thead>
            <tr>
              <th>#</th>
              <th className="billing-history__account-cell">Conta</th>
              <th>Vencimento</th>
              <th>Valor Base</th>
              <th>Valor Pago</th>
              <th>Status</th>
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