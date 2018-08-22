import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import CustomInput from '/imports/components/CustomInput/index';
import Calendar from '/imports/components/Calendar/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charges: this.props.contract.billing,
      totalValue: 0,
      equalDivision: false,
      difference: 0,
      valid: false,
      calendarOpen: false,
      startDate: new Date()
    }
  }

  componentDidMount() {
    var containers = this.props.contract.containers ? this.props.contract.containers : [];
    var accessories = this.props.contract.accessories ? this.props.contract.accessories : [];
    var services = this.props.contract.services ? this.props.contract.services : [];
    var all = this.props.contract.containers.concat(this.props.contract.accessories, this.props.contract.services);
    var charges = tools.deepCopy(this.state.charges);
    var equalDivision;
    if (all.length == 0) return 0;
    var totalValue = all.reduce((acc, current) => {
      return {
          price: acc.price + current.price
        }
      }).price;
    for (var i = 0; i < charges.length; i++) {
      if ((i+1) == charges.length) {
        equalDivision = true;
        break;
      }
      if (charges[i].value !== charges[i+1].value) {
        equalDivision = false;
      }
    }
    this.setState({ totalValue, equalDivision, charges });
  }

  representativesOnChange = (e) => {
    var representatives = e.target.value;
    this.setState({ representatives });
  }

  divisionChange = (e) => {
    var equalDivision = e.target.checked;
    if (equalDivision) this.setEqualValues();
    this.setState({ equalDivision });
  }

  setEqualValues = () => {
    var charges = tools.deepCopy(this.state.charges);
    var equalValue = tools.round(this.state.totalValue / this.state.charges.length, 2);
    var rest = tools.round(this.state.totalValue - (equalValue * this.state.charges.length), 2);
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
          value: this.state.equalValue ? this.state.charges[0].value : '',
          startDate: moment1,
          endDate: moment2
        })
      }
      charges = charges.concat(newCharges);
      this.setState({ charges });
    }
    if (value < charges.length) {
      for (var i = 0; i < value; i++) {
        newCharges.push(charges[i]);
      }
      this.setState({ charges: newCharges });
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
          <td>{(i + 1) + '/' + array.length}</td>
          <td>{moment(charge.startDate).format("DD-MM-YY") + ' a ' +  moment(charge.endDate).format("DD-MM-YY")}</td>
          <td>{moment(charge.endDate).format("DD-MM-YY")}</td>
          <td><textarea name={i} value={charge.description} onChange={this.updateDescription}/></td>
          <td>{this.state.equalDivision ? equalValueStr : <CustomInput name={i} type="currency"
                                                              onChange={this.onChange}
                                                              value={charge.value * 100}
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
    e ? e.preventDefault() : null;
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  changeDate = (startDate) => {
    this.setState({ startDate });
    this.toggleCalendar();
  }

  render() {
      return (
        <Box
          title="Tabela de Cobrança:"
          width="1000px"
          closeBox={this.props.toggleWindow}>
              <div className="billing">
                <div className="billing__item">
                  <label>Número de Cobranças:</label>
                  <CustomInput
                    type="number"
                    value={this.state.charges.length}
                    onChange={this.updateTable}/>
                </div>
                <div className="billing__item">
                  <label>Início da Cobrança:</label>
                  <input readOnly value={moment(this.state.startDate).format("DD-MMMM-YYYY")}
                    onClick={this.toggleCalendar} style={{cursor: "pointer"}}/>
                  {this.state.calendarOpen ? <Calendar
                                                closeCalendar={this.toggleCalendar}
                                                changeDate={this.changeDate}/> : null}
                </div>
                <div>
                  <label>Parcelas iguais:</label>
                  <input type="checkbox" checked={this.state.equalDivision} onChange={this.divisionChange}/>
                </div>
                <div>
                  <table className="table table--billing">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Período</th>
                        <th>Vencimento</th>
                        <th>Descrição da Cobrança</th>
                        <th>Valor</th>
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
                </div>
              </div>
              <FooterButtons buttons={[{text: "Salvar", onClick: () => this.props.updateContract(this.state.charges, "billing")}]}/>
        </Box>
      )
  }
}