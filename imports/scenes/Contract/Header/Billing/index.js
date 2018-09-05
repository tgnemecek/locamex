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
      startDate: this.props.contract.startDate,
      messageBox: false
    }
    var containers = this.props.contract.containers ? this.props.contract.containers : [];
    var accessories = this.props.contract.accessories ? this.props.contract.accessories : [];
    var services = this.props.contract.services ? this.props.contract.services : [];
    var all = this.props.contract.containers.concat(this.props.contract.accessories, this.props.contract.services);
    var charges = tools.deepCopy(this.state.charges);
    var equalDivision = calcIfEqualDivision(charges);
    var totalValue = calcTotalValue(all);
    function calcTotalValue(arr) {
      if (arr.length == 0) return 0;
      return arr.reduce((acc, current) => {
        return {
            price: acc.price + current.price
          }
        }).price;
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
    this.setState({ charges });
  }

  updateTable = (e) => {
    var value = Number(e.target.value);
    var charges = tools.deepCopy(this.state.charges);
    var newCharges = [];
    var difference = Math.abs(charges.length - value);
    var moment1 = moment(this.state.startDate).add((30 * i + i), 'days');
    var moment2 = moment(this.state.startDate).add((30 * i + 30 + i), 'days');
    if (value > charges.length) {
      for (var i = 0; i < difference; i++) {
        newCharges.push({
          description: `Cobrança #${i +  charges.length + 1} referente ao Valor Total do Contrato`,
          value: this.state.equalDivision ? this.state.charges[0].value : '',
          startDate: moment1,
          endDate: moment2
        })
      }
      charges = charges.concat(newCharges);
      this.setEqualValues(charges);
    }
    if (value < charges.length) {
      for (var i = 0; i < value; i++) {
        newCharges.push(charges[i]);
      }
      this.setEqualValues(newCharges);
    }
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
          <td className="small-column">{moment(charge.startDate).format("DD/MM/YYYY") + ' a ' +  moment(charge.endDate).format("DD/MM/YYYY")}</td>
          <td className="small-column">{moment(charge.endDate).format("DD/MM/YYYY")}</td>
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
    var className = this.state.difference != 0 ? "difference--danger" : "difference--zero";
    return <span className={className}>{value}</span>
  }

  toggleCalendar = (e) => {
    e ? e.stopPropagation() : null;
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  changeDate = (startDate) => {
    this.setState({ startDate });
    this.toggleCalendar();
  }

  saveEdits = () => {
    if (this.state.difference !== 0) {
      this.setState({ messageBox: true });
    } else {
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
            {this.state.messageBox ?
              <Box title="Aviso:">
                <p>O valor resultante das parcelas não coincide com o Valor Total do Contrato.</p>
                <FooterButtons buttons={[{text: "Voltar", onClick: () => this.setState({ messageBox: false })}]}/>
              </Box>
            : null}
              <Block columns={3}>
                <Input
                  title="Número de Cobranças:"
                  type="number"
                  value={this.state.charges.length}
                  onChange={this.updateTable}
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
                    <th colSpan="4"><b>Valor Total do Contrato:</b></th>
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