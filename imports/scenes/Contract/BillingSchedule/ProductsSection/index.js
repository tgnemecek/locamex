import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import CalendarBar from '/imports/components/CalendarBar/index';

import ExpiryDate from './ExpiryDate/index';

export default class ProductsSection extends React.Component {
  // Calculations: -------------------------------------------------------------

  sumValues = () => {
    var value = this.props.billingProducts.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    return isNaN(value) ? 0 : value;
  }

  displayDifference = () => {
    var difference = 0 - (this.props.productsValue - this.sumValues());
    var className = difference !== 0 ? "billing-schedule__difference--danger" : "billing-schedule__difference--zero";
    return <span className={className}>{tools.format(difference, "currency")}</span>
  }

  updateBilling = (billingProducts) => {
    this.props.updateBilling({
      billingProducts
    })
  }


  // Rendering: ----------------------------------------------------------------

  renderBody = () => {
    var startDate = this.props.billingProducts.startDate;
    return this.props.billingProducts.map((charge, i, array) => {
      const onChangePrice = (e) => {
        var value = Number(e.target.value);
        var billingProducts = [...array];
        billingProducts[i].value = value;
        this.props.updateBilling({
          billingProducts
        });
      }
      const onChangeDescription = (e) => {
        var value = e.target.value;
        var billingProducts = [...array];
        billingProducts[i].description = value;
        this.props.updateBilling({
          billingProducts
        });
      }
      return (
        <tr key={i}>
          <td>{(i + 1) + '/' + array.length}</td>
          <td>
            {moment(charge.startDate).format("DD/MM/YY") + ' a ' +  moment(charge.endDate).format("DD/MM/YY")}
          </td>
          <td>
            {moment(charge.expiryDate).format("DD/MM/YY")}
          </td>
          <td className="no-padding">
            <Input
              name={i}
              value={charge.description}
              onChange={onChangeDescription}
              disabled={this.props.disabled}
              type="textarea"/>
          </td>
          <td className="no-padding">
            <Input name={i} type="currency"
              style={{textAlign: 'right'}}
              name="value"
              onChange={onChangePrice}
              disabled={this.props.disabled}
              value={charge.value}/>
          </td>
        </tr>
      )
    })
  }

  render() {
    if (this.props.billingProducts[0]) {
      return (
        <section className="billing-schedule__products-section">
          <h4>Cobranças de Locação:</h4>
          <div className="billing-schedule__products-header">
            <Input
              title="Número de Cobranças:"
              type="number"
              disabled={true}
              value={this.props.billingProducts.length}/>
            <Input
              title="Início:"
              disabled={true}
              value={moment(this.props.billingProducts[0].startDate).format("DD/MM/YYYY")}/>
            <ExpiryDate
              disabled={this.props.disabled}
              billingProducts={this.props.billingProducts}
              updateBilling={this.props.updateBilling}
            />
            <this.props.AccountsSelector
              disabled={this.props.disabled}
              billing={this.props.billingProducts}
              updateBilling={this.updateBilling}
            />
            <this.props.EqualCharges
              disabled={this.props.disabled}
              calculation={this.props.calculation}
              billing={this.props.billingProducts}
              updateBilling={this.updateBilling}/>
          </div>
          <div className="billing-schedule__scroll-div">
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Período</th>
                  <th>Vencimento</th>
                  <th className="table__wide">
                    Descrição da Cobrança
                  </th>
                  <th className="billing-schedule__value-cell">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
          <table className="table billing-schedule__footer">
            <tfoot>
              <tr>
                <td className="billing-schedule__footer-cell table__wide">
                  Diferença:
                </td>
                <td className="billing-schedule__footer-cell billing-schedule__value-cell">
                  {this.displayDifference()}
                </td>
              </tr>
              <tr>
                <th className="billing-schedule__footer-cell table__wide">
                  <b>Valor Total de Locação:</b></th>
                <th className="billing-schedule__footer-cell billing-schedule__value-cell">
                  {tools.format(this.props.productsValue, "currency")}
                </th>
              </tr>
            </tfoot>
          </table>
        </section>
      )
    } else return null;
  }
}