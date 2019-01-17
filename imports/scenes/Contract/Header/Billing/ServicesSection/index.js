import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';

export default class ServicesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarOpen: false
    }
  }

  // Calculations: -------------------------------------------------------------

  sumValues = () => {
    var value = this.props.charges.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    return isNaN(value) ? 0 : value;
  }

  displayDifference = () => {
    var difference = 0 - (this.props.servicesValue - this.sumValues());
    var className = difference !== 0 ? "billing__difference--danger" : "billing__difference--zero";
    return <span className={className}>{tools.format(difference, "currency")}</span>
  }

  // Changing States: ----------------------------------------------------------

  onChangeTaxes = (e) => {
    this.props.updateBilling(e.target.name, e.target.value);
  }

  toggleCalendar = (e) => {
    e ? e.stopPropagation() : null;
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  // Rendering: ----------------------------------------------------------------

  renderBody = () => {
    return this.props.charges.map((charge, i, array) => {
      const onChangePrice = (e) => {
        var value = e.target.value;
        var newCharges = tools.deepCopy(array);
        newCharges[i].value = value;
        this.props.updateBilling('billingServices', newCharges);
      }
      const onChangeDescription = (e) => {
        var value = e.target.value;
        var newCharges = tools.deepCopy(array);
        newCharges[i].description = value;
        this.props.updateBilling('billingServices', newCharges);
      }
      const changeDate = (e) => {
        var endDate = e.target.value;
        var charges = array.map((charge, i) => {
          return {
            ...charge,
            endDate: moment(endDate).toDate()
          }
        })
        this.toggleCalendar();
        this.props.updateBilling('billingServices', array);
      }
      const calculateLiquid = () => {
        var value = charge.value;
        if (!value) return tools.format(0, "currency");

        var inssDiscount = (value * this.props.inss) / 100;
        var issDiscount = (value * this.props.iss) / 100;
        value = value - (inssDiscount + issDiscount);
        return tools.format(value, "currency");
      }
      return (
        <tr key={i}>
          <td>{(i + 1) + '/' + array.length}</td>
          <td>
            <Input
              type="calendar"
              style={{textAlign: 'center'}}
              calendarOpen={this.state.calendarOpen}
              toggleCalendar={this.toggleCalendar}
              onChange={changeDate}
              value={charge.endDate}/>
          </td>
          <td>
            <Input name={i} value={charge.description} onChange={onChangeDescription} type="textarea"/>
          </td>
          <td>{calculateLiquid()}</td>
          <td>
            <Input name={i} type="currency"
              style={{textAlign: 'right'}}
              name="value"
              onChange={onChangePrice}
              value={charge.value}/>
          </td>
        </tr>
      )
    })
  }

  render() {
    var ChargesNumber = this.props.ChargesNumber;
    var EqualCharges = this.props.EqualCharges;

    if (this.props.servicesValue) {
      return (
        <Block title="Pacote de Serviços:" columns={1} style={{marginTop: "10px"}}>
          <Block columns={3} options={[{block: 1, span: 0.5}, {block: 2, span: 0.5}, {block: 3, span: 1, className: "billing__equal-charges"}]}>
            <ChargesNumber
              masterValue={this.props.servicesValue}
              stateKey="billingServices"
              charges={this.props.charges}
              description="Pacote de Serviços - Informamos: Pagamentos de Notas Fiscais Eletrônicas (NFe) são exclusivos através de Depósito Bancário junto ao Banco Itaú S.A. (341) Agência 1571 C/C 02313-2 a favor da LOCADORA."
              updateBilling={this.props.updateBilling}/>
            <Input
              title="INSS: (%)"
              type="number"
              name="inss"
              value={this.props.inss}
              onChange={this.onChangeTaxes}/>
            <Input
              title="ISS: (%)"
              type="number"
              name="iss"
              value={this.props.iss}
              onChange={this.onChangeTaxes}/>
            <EqualCharges
              masterValue={this.props.servicesValue}
              stateKey="billingServices"
              charges={this.props.charges}
              updateBilling={this.props.updateBilling}/>
          </Block>
          <table className="table table--billing--services">
            <thead>
              <tr>
                <th>Número</th>
                <th>Vencimento</th>
                <th>Descrição da Cobrança</th>
                <th>Valor Líquido</th>
                <th>Valor Bruto</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="billing__table__footer">Diferença:</td>
                <td className="table__small-column">{this.displayDifference()}</td>
              </tr>
              <tr>
                <th colSpan="3" className="billing__table__footer"><b>Valor Total do Pacote de Serviços:</b></th>
                <th className="table__small-column">{tools.format(this.props.servicesValue, "currency")}</th>
              </tr>
            </tfoot>
          </table>
        </Block>
      )
    } else return null;
  }
}