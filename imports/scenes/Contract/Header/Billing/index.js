import React from 'react';
import moment from 'moment';

import customTypes from '/imports/startup/custom-types';
import CustomInput from '/imports/components/CustomInput/index';
import Calendar from '/imports/components/Calendar/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charges: [],
      equalDivision: true,
      difference: 0,
      valid: false,
      calendarOpen: false,
      startDate: new Date()
    }
    this.totalValue = this.countPrices(this.props.contract.containers) +
                      this.countPrices(this.props.contract.accessories) +
                      this.countPrices(this.props.contract.services);
    this.inputValues = [];
  }

  countPrices = (arr) => {
    if (arr.length == 0) return 0;
    return this.props.contract[arr].reduce((acc, current) => {
      return {
        price: acc.price + current.price
      }
    }).price;
  }

  representativesOnChange = (e) => {
    var representatives = e.target.value;
    this.setState({ representatives });
  }

  divisionChange = (e) => {
    var equalDivision = e.target.checked;
    this.setState({ equalDivision });
  }

  updateTable = (e) => {
    var value = Number(e.target.value);
    var charges = customTypes.deepCopy(this.state.charges);
    var newCharges = [];
    var difference = Math.abs(charges.length - value);
    if (value > charges.length) {
      for (var i = 0; i < difference; i++) {
        newCharges.push({
          description: `Cobrança #${i +  charges.length + 1} referente ao Valor Total do Contrato`,
          value: ''
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
    this.inputValues[e.target.name] = e.target.value;
    var total = this.inputValues.reduce((acc, current) => acc + current);
    var difference = total - this.totalValue;
    this.setState({
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
    var equalValue = customTypes.round(this.totalValue / this.state.charges.length, 2);
    var equalValueStr;
    var rest = customTypes.round(this.totalValue - (equalValue * this.state.charges.length), 2);
    return this.state.charges.map((charge, i, array) => {
      var moment1 = moment(this.state.startDate).add((30 * i + i), 'days');
      var moment2 = moment(this.state.startDate).add((30 * i + 30 + i), 'days');
      if (i == 0) {
        equalValueStr = customTypes.format(equalValue + rest, "currency");
      } else {
        equalValueStr = customTypes.format(equalValue, "currency");
      }
      return (
        <tr key={i}>
          <td>{(i + 1) + '/' + array.length}</td>
          <td>{moment1.format("DD-MM-YY") + ' a ' +  moment2.format("DD-MM-YY")}</td>
          <td>{moment2.format("DD-MM-YY")}</td>
          <td><textarea name={i} value={charge.description} onChange={this.updateDescription}/></td>
          <td>{this.state.equalDivision ? equalValueStr : <CustomInput name={i} type="currency"
                                                              onChange={this.onChange}
                                                              placeholder={equalValueStr}
                                                              />}</td>
        </tr>
      )
    })
  }

  calcDifference = () => {
    var value = customTypes.format(this.state.difference, 'currency');
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
                        <th>{customTypes.format(this.totalValue, "currency")}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <FooterButtons buttons={[{text: "Salvar", onClick: () => this.saveEdits()}]}/>
        </Box>
      )
  }
}