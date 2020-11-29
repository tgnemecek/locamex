import React from "react";
import moment from "moment";

import tools from "/imports/startup/tools/index";
import Input from "/imports/components/Input/index";
import CalendarBar from "/imports/components/CalendarBar/index";

import ChargesNumber from "./ChargesNumber/index";

export default class ServicesSection extends React.Component {
  displayDifference = () => {
    var difference = this.props.getDifference("services");
    var className =
      difference !== 0
        ? "billing-schedule__difference--danger"
        : "billing-schedule__difference--zero";
    return (
      <span className={className}>{tools.format(difference, "currency")}</span>
    );
  };

  updateBilling = (billingServices) => {
    this.props.updateBilling({
      billingServices,
    });
  };

  // Changing States: ----------------------------------------------------------

  onChangeTaxes = (e) => {
    var value = Number(e.target.value);
    var billingServices = this.props.billingServices.map((bill) => {
      return {
        ...bill,
        [e.target.name]: e.target.value,
      };
    });
    this.props.updateBilling({
      billingServices,
    });
  };

  // Rendering: ----------------------------------------------------------------

  renderBody = () => {
    return this.props.billingServices.map((bill, i, array) => {
      const onChangePrice = (e) => {
        var value = Number(e.target.value);
        var billingServices = [...array];
        billingServices[i].value = value;
        this.props.updateBilling({
          billingServices,
        });
      };
      const onChangeDescription = (e) => {
        var value = e.target.value;
        var billingServices = [...array];
        billingServices[i].description = value;
        this.props.updateBilling({
          billingServices,
        });
      };
      const changeExpiryDate = (e) => {
        var expiryDate = e.target.value;
        var billingServices = [...array];
        billingServices[i].expiryDate = moment(expiryDate).toDate();
        this.props.updateBilling({
          billingServices,
        });
      };
      const calculateTaxes = () => {
        var value = bill.value;
        if (!value) return tools.format(0, "currency");

        var inssDiscount = value * this.props.billingServices[0].inss;
        var issDiscount = value * this.props.billingServices[0].iss;
        value = inssDiscount + issDiscount;
        return tools.format(value, "currency");
      };
      return (
        <tr key={i}>
          <td>{i + 1 + "/" + array.length}</td>
          <td className="no-padding">
            <CalendarBar
              onChange={changeExpiryDate}
              disabled={this.props.disabled}
              value={bill.expiryDate}
            />
          </td>
          <td className="no-padding">
            <Input
              name={i}
              value={bill.description}
              onChange={onChangeDescription}
              disabled={this.props.disabled}
              type="textarea"
            />
          </td>
          <td>{calculateTaxes()}</td>
          <td className="no-padding">
            <Input
              name={i}
              type="currency"
              style={{ textAlign: "right" }}
              name="value"
              allowNegative={false}
              onChange={onChangePrice}
              disabled={this.props.disabled}
              value={bill.value}
            />
          </td>
        </tr>
      );
    });
  };

  render() {
    if (this.props.billingServices[0]) {
      return (
        <section className="billing-schedule__services-section">
          <h4>Pacote de Serviços:</h4>
          <div className="billing-schedule__services-header">
            <ChargesNumber
              disabled={this.props.disabled}
              billingServices={this.props.billingServices}
              setBilling={this.props.setBilling}
            />
            <Input
              title="INSS: (%)"
              type="percent"
              name="inss"
              disabled={this.props.disabled}
              value={this.props.billingServices[0].inss}
              onChange={this.onChangeTaxes}
            />
            <Input
              title="ISS: (%)"
              type="percent"
              name="iss"
              disabled={this.props.disabled}
              value={this.props.billingServices[0].iss}
              onChange={this.onChangeTaxes}
            />
            <this.props.AccountsSelector
              disabled={this.props.disabled}
              billing={this.props.billingServices}
              updateBilling={this.updateBilling}
            />
            <this.props.EqualCharges
              disabled={this.props.disabled}
              calculation={this.props.calculation}
              billing={this.props.billingServices}
              updateBilling={this.updateBilling}
            />
          </div>
          <div className="billing-schedule__scroll-div">
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th style={{ minWidth: "120px" }}>Vencimento</th>
                  <th className="table__wide">Descrição da Cobrança</th>
                  <th>INSS + ISS</th>
                  <th className="billing-schedule__value-cell">Valor</th>
                </tr>
              </thead>
              <tbody>{this.renderBody()}</tbody>
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
                  <b>Valor Total do Pacote de Serviços:</b>
                </th>
                <th className="billing-schedule__footer-cell billing-schedule__value-cell">
                  {tools.format(this.props.servicesValue, "currency")}
                </th>
              </tr>
            </tfoot>
          </table>
        </section>
      );
    } else return null;
  }
}
