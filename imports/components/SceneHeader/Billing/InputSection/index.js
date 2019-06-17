import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class InputSection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      calendarOpen: false
    }
  }

  // Calendar & Dates: ---------------------------------------------------------

  toggleCalendar = (e) => {
    e ? e.stopPropagation() : null;
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  changeDate = (e) => {
    var startDate = e.target.value;
    var charges = this.props.charges.map((charge, i) => {
      return {
        ...charge,
        startDate: moment(startDate).add((30 * i + i), 'days').toDate(),
        endDate: moment(startDate).add((30 * i + 30 + i), 'days').toDate(),
      }
    })
    this.toggleCalendar();
    this.props.updateParent(this.props.key, array);
  }

  totalValue = () => {
    var array = this.props.charges;
    return array.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0)
  }

  updateTableLength = (e) => {
    var value = Number(e.target.value);
    var array = tools.deepCopy(this.props.charges);
    var newArray = [];
    var difference = Math.abs(array.length - value);
    if (value > array.length) {
      for (var i = 0; i < difference; i++) {
        var chargeValue = this.props.charges[0] ? this.props.charges[0].value : '';
        newArray.push({
          description: `Cobrança #${i +  array.length + 1} referente ao Valor Total do Contrato`
        })
      }
      array = array.concat(newArray);
      array = this.setEqualValues(array);
    } else if (value < array.length) {
      for (var i = 0; i < value; i++) {
        newArray.push(array[i]);
      }
      array = this.setEqualValues(newArray);
    }
    array = this.updateChargesDates(array);
    this.props.updateParent(this.props.key, array);
  }

  divisionChange = (e) => {
    var equalDivision = e.target.value;
    this.setState({ equalDivision }, () => {
      if (equalDivision) this.setEqualValues();
    });
  }

  setEqualValues = (array) => {
    var array = array || tools.deepCopy(this.props.charges);
    var totalValue = this.totalValue();
    var equalValue = tools.round(totalValue / array.length, 2);
    var rest = tools.round(totalValue - (equalValue * array.length), 2);
    array.forEach((charge, i) => {
      if (i == 0) charge.value = (equalValue + rest);
      else charge.value = equalValue;
    })
    this.props.updateParent(this.props.key, array);
  }

  render() {
    return (
      <Block columns={3}>
        <Input
          title="Número de Cobranças:"
          type="number"
          value={this.props.charges.length}
          onChange={this.updateTableLength}/>
        <Input
          title="Início da Cobrança:"
          type="calendar"
          calendarOpen={this.state.calendarOpen}
          toggleCalendar={this.toggleCalendar}
          onChange={this.changeDate}
          value={this.props.charges[0].startDate}/>
        <Input
          title="Cobranças iguais:"
          type="checkbox"
          id="master__billing__equalValue"
          onChange={this.divisionChange}
          value={this.props.equalDivision}/>
      </Block>
    )
  }
}