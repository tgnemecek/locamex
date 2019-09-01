import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import CalendarBar from '/imports/components/CalendarBar/index';

import ChargesNumber from './ChargesNumber/index';

export default class ServicesSection extends React.Component {
  // Calculations: -------------------------------------------------------------

  sumValues = () => {
    var value = this.props.billingServices.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    value = tools.round(value, 2);
    return isNaN(value) ? 0 : value;
  }

  displayDifference = () => {
    var difference = 0 - (this.props.servicesValue - this.sumValues());
    var className = difference !== 0 ? "billing-schedule__difference--danger" : "billing-schedule__difference--zero";
    return <span className={className}>{tools.format(difference, "currency")}</span>
  }

  updateCharges = (billingServices) => {
    this.props.updateBilling({
      billingServices
    })
  }

  // Changing States: ----------------------------------------------------------

  onChangeTaxes = (e) => {
    var value = Number(e.target.value);
    var billingServices = this.props.billingServices.map((charge) => {
      return {
        ...charge,
        [e.target.name]: e.target.value
      }
    })
    this.props.updateBilling({
      billingServices
    });
  }

  // Rendering: ----------------------------------------------------------------

  renderBody = () => {
    return this.props.billingServices.map((charge, i, array) => {
      const onChangePrice = (e) => {
        var value = Number(e.target.value);
        var billingServices = [...array];
        billingServices[i].value = value;
        this.props.updateBilling({
          billingServices
        });
      }
      const onChangeDescription = (e) => {
        var value = e.target.value;
        var billingServices = [...array];
        billingServices[i].description = value;
        this.props.updateBilling({
          billingServices
        });
      }
      const changeExpiryDate = (e) => {
        var expiryDate = e.target.value;
        var billingServices = [...array];
        billingServices[i].expiryDate = moment(expiryDate).toDate();
        this.props.updateBilling({
          billingServices
        });
      }
      const calculateTaxes = () => {
        var value = charge.value;
        if (!value) return tools.format(0, "currency");

        var inssDiscount = (value * this.props.billingServices[0].inss) / 100;
        var issDiscount = (value * this.props.billingServices[0].iss) / 100;
        value = inssDiscount + issDiscount;
        return tools.format(value, "currency");
      }
      return (
        <tr key={i}>
          <td>{(i + 1) + '/' + array.length}</td>
          <td>
            <CalendarBar
              onChange={changeExpiryDate}
              value={charge.expiryDate}/>
          </td>
          <td>
            <Input name={i} value={charge.description} onChange={onChangeDescription} type="textarea"/>
          </td>
          <td>{calculateTaxes()}</td>
          <td>
            <Input name={i} type="currency"
              style={{textAlign: 'right'}}
              name="value"
              allowNegative={true}
              onChange={onChangePrice}
              value={charge.value}/>
          </td>
        </tr>
      )
    })
  }

  render() {
    var EqualCharges = this.props.EqualCharges;
    if (this.props.servicesValue) {
      return (
        <section className="billing-schedule__services-section">
          <h4>Pacote de Serviços:</h4>
          <div className="billing-schedule__services-header">
            <ChargesNumber
              billingServices={this.props.billingServices}
              setCharges={this.props.setCharges}/>
            <Input
              title="INSS: (%)"
              type="number"
              name="inss"
              value={this.props.billingServices[0].inss}
              onChange={this.onChangeTaxes}/>
            <Input
              title="ISS: (%)"
              type="number"
              name="iss"
              value={this.props.billingServices[0].iss}
              onChange={this.onChangeTaxes}/>
            <EqualCharges
              masterValue={this.props.servicesValue}
              charges={this.props.billingServices}
              updateCharges={this.updateCharges}/>
          </div>
          <table className="table table--billing-schedule--services">
            <thead>
              <tr>
                <th>Número</th>
                <th>Vencimento</th>
                <th>Descrição da Cobrança</th>
                <th>INSS + ISS</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="billing-schedule__table__footer">Diferença:</td>
                <td className="table__small-column">{this.displayDifference()}</td>
              </tr>
              <tr>
                <th colSpan="3" className="billing-schedule__table__footer"><b>Valor Total do Pacote de Serviços:</b></th>
                <th className="table__small-column">{tools.format(this.props.servicesValue, "currency")}</th>
              </tr>
            </tfoot>
          </table>
        </section>
      )
    } else return null;
  }
}