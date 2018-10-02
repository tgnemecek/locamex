import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charges: this.props.contract.billing || [],
      totalValue: 0,
      equalDivision: false,
      difference: 0,
      valid: false,
      calendarOpen: false,
      startDate: new Date(),

      errorKeys: [],
      errorMsg: ''
    }
    var duration = this.props.contract.dates.duration || 1;
    var containers = this.props.contract.containers || [];
    var accessories = this.props.contract.accessories || [];
    var services = this.props.contract.services || [];

    var containersValue = calcTotalValue(containers, duration);
    var accessoriesValue = calcTotalValue(accessories, duration);
    var servicesValue = calcTotalValue(services, 1);
    var totalValue = containersValue + accessoriesValue + servicesValue;

    var charges = tools.deepCopy(this.state.charges);
    var equalDivision = calcIfEqualDivision(charges);

    function calcTotalValue (arr, duration) {
      if (arr.length == 0) return 0;
      return arr.reduce((acc, current) => {
        var quantity = current.quantity ? current.quantity : 1;
        return acc + (current.price * quantity * duration)
      }, 0);
    }
    function calcIfEqualDivision(charges) {
      if (!charges.length) return false;
      for (var i = 0; i < charges.length; i++) {
        if ((i+1) == charges.length) {
          return true;
        }
        if (charges[i].value !== charges[i+1].value) {
          return false;
        }
      }
    }
    this.state = {...this.state, totalValue, equalDivision, charges};
  }

  representativesOnChange = (e) => {
    var representatives = e.target.value;
    this.setState({ representatives });
  }

  divisionChange = (e) => {
    var equalDivision = e.target.value;
    if (equalDivision) this.setEqualValues();
    this.setState({ equalDivision });
  }

  setEqualValues = (charges) => {
    var charges = charges || tools.deepCopy(this.state.charges);
    var equalValue = tools.round(this.state.totalValue / charges.length, 2);
    var rest = tools.round(this.state.totalValue - (equalValue * charges.length), 2);
    charges.forEach((charge, i) => {
      if (i == 0) charge.value = (equalValue + rest);
      else charge.value = equalValue;
    })
    return charges;
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

  updateTableLength = (e) => {
    var value = Number(e.target.value);
    var charges = tools.deepCopy(this.state.charges);
    var newCharges = [];
    var difference = Math.abs(charges.length - value);
    if (value > charges.length) {
      for (var i = 0; i < difference; i++) {
        var chargeValue = this.state.charges[0] ? this.state.charges[0].value : '';
        newCharges.push({
          description: `Cobrança #${i +  charges.length + 1} referente ao Valor Total do Contrato`
        })
      }
      charges = charges.concat(newCharges);
      charges = this.setEqualValues(charges);
    } else if (value < charges.length) {
      for (var i = 0; i < value; i++) {
        newCharges.push(charges[i]);
      }
      charges = this.setEqualValues(newCharges);
    }
    charges = this.updateChargesDates(charges);
    this.setState({ charges });
  }

  onChange = (e) => {
    var value = e.target.value;
    var charges = this.state.charges;
    charges[e.target.name].value = value;
    var total = charges.reduce((acc, current) => {
      return {
          value: acc.value + Number(current.value)
        }
      }).value;
    var difference = total - this.state.totalValue;
    this.setState({
      charges,
      difference,
      valid: !difference
    });
  }

  updateDescription = (e) => {
    var charges = this.state.charges;
    charges[e.target.name].description = e.target.value;
    this.setState({ charges });
  }

  renderBody = () => {
    return this.state.charges.map((charge, i, array) => {
      var equalValueStr = tools.format(charge.value, "currency");
      return (
        <tr key={i}>
          <td className="small-column">{(i + 1) + '/' + array.length}</td>
          <td className="small-column">{moment(charge.startDate).format("DD/MM/YY") + ' a ' +  moment(charge.endDate).format("DD/MM/YY")}</td>
          <td className="small-column">{moment(charge.endDate).format("DD/MM/YY")}</td>
          <td><textarea name={i} value={charge.description} onChange={this.updateDescription}/></td>
          <td className="small-column">{this.state.equalDivision ? equalValueStr : <Input name={i} type="currency"
                                                              onChange={this.onChange}
                                                              value={charge.value}
                                                              placeholder={equalValueStr}
                                                              />}</td>
        </tr>
      )
    })
  }

  calcDifference = () => {
    var value = tools.format(this.state.difference, 'currency');
    var className = this.state.difference !== 0 ? "billing__difference--danger" : "billing__difference--zero";
    return <span className={className}>{value}</span>
  }

  toggleCalendar = (e) => {
    e ? e.stopPropagation() : null;
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  changeDate = (e) => {
    var startDate = e.target.value;
    this.setState({ startDate }, () => {
      var charges = this.updateChargesDates();
      this.setState({ charges });
      this.toggleCalendar();
    });
  }

  saveEdits = () => {
    if (this.state.difference !== 0) {
      this.setState({ errorMsg: 'O valor resultante das parcelas não coincide com o Valor Total do Contrato.' });
    } else if (this.state.totalValue === 0) {
      this.setState({
        errorKeys: ["totalValue"],
        errorMsg: 'O Valor Total do Contrato não pode ser zero. Adicione produtos antes.'
      });
    } else {
      for (var i = 0; i < this.state.charges.length; i++) {
        if (this.state.charges[i].value <= 0) {
          this.setState({
            errorKeys: ["zeroCharges"],
            errorMsg: 'Não deve haver cobranças com valor zero.'
          })
          return;
        }
      }
      this.props.updateContract(this.state.charges, "billing");
      this.props.toggleWindow();
    }
  }

  render() {
      return (
        <Box
          title="Tabela de Cobrança:"
          width="1000px"
          closeBox={this.props.toggleWindow}>
          <div className={this.props.contract.status !== 'inactive' ? "contract--disabled" : null}>
            <div className="error-message">{this.state.errorMsg}</div>
              <Block columns={3}>
                <Input
                  title="Número de Cobranças:"
                  type="number"
                  value={this.state.charges.length}
                  onChange={this.updateTableLength}
                />
                <Input
                  title="Início da Cobrança:"
                  type="calendar"
                  calendarOpen={this.state.calendarOpen}
                  toggleCalendar={this.toggleCalendar}
                  onChange={this.changeDate}
                  value={this.state.startDate}
                />
                <Input
                  title="Cobranças iguais:"
                  type="checkbox"
                  id="contract__billing__equalValue"
                  onChange={this.divisionChange}
                  value={this.state.equalDivision}
                />
              </Block>
              <table className="table table--billing">
                <thead>
                  <tr>
                    <th className="small-column">Número</th>
                    <th className="small-column">Período</th>
                    <th className="small-column">Vencimento</th>
                    <th>Descrição da Cobrança</th>
                    <th className="small-column">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderBody()}
                </tbody>
                <tfoot>
                  <tr style={this.state.equalDivision ? {display: 'none'} : {display: 'inherit'}}>
                    <td colSpan="4" style={{fontStyle: "italic"}}>Diferença:</td>
                    <td>{this.calcDifference()}</td>
                  </tr>
                  <tr>
                    <th colSpan="4" ><b>Valor Total do Contrato:</b></th>
                    <th>{tools.format(this.state.totalValue, "currency")}</th>
                  </tr>
                </tfoot>
              </table>
              {this.props.contract.status == 'inactive' ?
                <FooterButtons buttons={[{text: "Salvar", onClick: () => this.saveEdits()}]}/>
              : null}
          </div>
        </Box>
      )
  }
}