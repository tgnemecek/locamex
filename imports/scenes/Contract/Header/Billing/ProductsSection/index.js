import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';

export default class ProductsSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarOpen: false,
      startDate: this.props.charges[0] ? this.props.charges[0].startDate : new Date()
    }
  }

  toggleCalendar = (e) => {
    e ? e.stopPropagation() : null;
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  changeDate = (e) => {
    var startDate = e.target.value;

    const updateChargesDates = () => {
      return this.props.charges.map((charge, i) => {
        return {
          ...charge,
          startDate: moment(this.state.startDate).add((30 * i + i), 'days').toDate(),
          endDate: moment(this.state.startDate).add((30 * i + 30 + i), 'days').toDate(),
        }
      })
    }

    this.setState({ startDate }, () => {
      var charges = updateChargesDates();
      this.updateBilling('billingProducts', charges);
      this.toggleCalendar();
    });
  }

  updateChargesDates = (input) => {
    var array = input || this.state.charges;
    var charges = array.map((charge, i) => {
      return {
        ...charge,
        startDate: moment(this.state.startDate).add((30 * i + i), 'days').toDate(),
        endDate: moment(this.state.startDate).add((30 * i + 30 + i), 'days').toDate(),
      }
    })
    return charges;
  }

  // Calculations: -------------------------------------------------------------

  sumValues = () => {
    var value = this.props.charges.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);
    return isNaN(value) ? 0 : value;
  }

  displayDifference = () => {
    var difference = 0 - (this.props.productsValue - this.sumValues());
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
      return (
        <tr key={i}>
          <td>{(i + 1) + '/' + array.length}</td>
          <td>{moment(charge.startDate).format("DD/MM/YY") + ' a ' +  moment(charge.endDate).format("DD/MM/YY")}</td>
          <td>
            <Input
              type="calendar"
              calendarOpen={this.state.calendarOpen}
              toggleCalendar={this.toggleCalendar}
              onChange={changeDate}
              value={charge.endDate}/>
          </td>
          <td>
            <Input name={i} value={charge.description} onChange={onChangeDescription} type="textarea"/>
          </td>
          <td>
            <Input name={i} type="currency"
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

    if (this.props.productsValue) {
      return (
        <Block title="Mensalidade:" columns={1}>
          <Block columns={3}>
            <ChargesNumber
              masterValue={this.props.productsValue}
              stateKey="billingProducts"
              charges={this.props.charges}
              description="Locação - Informamos: Locações são cobradas através de Faturas de Locação de Bens Móveis plenamente contabilizáveis."
              updateBilling={this.props.updateBilling}/>
            <Input
              title="Início da Cobrança:"
              type="calendar"
              calendarOpen={this.state.calendarOpen}
              toggleCalendar={this.toggleCalendar}
              onChange={this.changeDate}
              value={this.state.startDate}/>
            <EqualCharges
              masterValue={this.props.productsValue}
              stateKey="billingProducts"
              charges={this.props.charges}
              updateBilling={this.props.updateBilling}/>
          </Block>
          <table className="table table--billing--products">
            <thead>
              <tr>
                <th className="table__small-column">Número</th>
                <th className="billing__table__end-date">Período</th>
                <th className="billing__table__end-date">Vencimento</th>
                <th>Descrição da Cobrança</th>
                <th className="billing__table__brute-price-column">Valor</th>
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
                <th className="table__small-column">{tools.format(this.props.productsValue, "currency")}</th>
              </tr>
            </tfoot>
          </table>
        </Block>
      )
    } else return null;
  }
}