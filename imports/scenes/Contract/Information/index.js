import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';

export default class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarOpen: false
    }
  }

  toggleCalendar = (e) => {
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  changeDuration = (e) => {
    var duration = e.target.value;
    var discount = 0;
    if (this.props.contract.dates.timeUnit === "months") {
      if (duration === 1) {
        discount = 0;
      } else if (duration > 1 && duration <= 3) {
        discount = 0.2;
      } else if (duration > 3 && duration <= 6) {
        discount = 0.25;
      } else if (duration > 6 && duration <= 9) {
        discount = 0.3;
      } else if (duration > 9 && duration <= 12) {
        discount = 0.3;
      } else if (duration > 12) {
        discount = 0.4;
      }
    }
    var dates = {...this.props.contract.dates};
    dates.duration = duration;
    this.props.updateContract({
      dates,
      discount
    });
  }

  changeTimeUnit = (e) => {
    var timeUnit = e.target.value;
    var dates = {...this.props.contract.dates};
    var discount = 0;
    dates.duration = 1;
    dates.timeUnit = timeUnit;
    this.props.updateContract({
      dates,
      discount
    })
  }

  handleChange = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    var extra = e.target.extra;

    if (!extra) {
      this.props.updateContract({[name]: value});
    } else {
      var obj = {...this.props.contract[extra]};
      obj[name] = value;
      this.props.updateContract({[extra]: obj});
    }
  }

  cepButtonClick = (data) => {
    if (!data.cep) return;
    var deliveryAddress = {
      ...this.props.contract.deliveryAddress,
      street: data.logradouro,
      district: data.bairro,
      city: data.localidade,
      state: data.uf,
      number: '',
      additional: ''
    };
    this.props.updateContract({ deliveryAddress });
  }

  render() {
      return (
          <Block
            className="contract__information"
            columns={6}
            options={[
              {block: 0, span: 2},
              {block: 2, span: 2},
              {block: 5, span: 0.5},
              {block: 6, span: 0.5},
              {block: 9, span: 0.5},
              {block: 10, span: 0.5}]}>
            <SuggestionBar
              title="Cliente:"
              name="clientId"
              database={this.props.clientsDatabase}
              style={this.props.errorKeys.includes("clientId") ? {borderColor: "red"} : null}
              value={this.props.contract.clientId}
              onClick={this.handleChange}>
            </SuggestionBar>
            <Input
              title="Nº de Proposta:"
              name="proposal"
              type="text"
              style={this.props.errorKeys.includes("proposal") ? {borderColor: "red"} : null}
              value={this.props.contract.proposal}
              onChange={this.handleChange}
            />
            <Input
              title="Endereço de Entrega:"
              name="street"
              type="text"
              extra="deliveryAddress"
              style={this.props.errorKeys.includes("street") ? {borderColor: "red"} : null}
              value={this.props.contract.deliveryAddress.street}
              onChange={this.handleChange}
            />
            <Input
              title="CEP:"
              name="cep"
              type="cep"
              extra="deliveryAddress"
              style={this.props.errorKeys.includes("cep") ? {borderColor: "red"} : null}
              buttonClick={this.cepButtonClick}
              value={this.props.contract.deliveryAddress.cep}
              onChange={this.handleChange}
            />
            <Input
              title="Data da Entrega:"
              type="calendar"
              name="startDate"
              extra="dates"
              calendarOpen={this.state.calendarOpen}
              toggleCalendar={this.toggleCalendar}
              onChange={this.handleChange}
              value={this.props.contract.dates.startDate}
            />
            <Input
              title="Desconto:"
              name="discount"
              type="number"
              max={100}
              style={this.props.errorKeys.includes("discount") ? {borderColor: "red"} : null}
              value={(this.props.contract.discount) * 100}
              onChange={(e) => this.handleChange({target: {value: tools.round((Number(e.target.value) / 100), 2), name: e.target.name}})}
            />
            <Input
              title="Duração:"
              value={this.props.contract.dates.duration}
              onChange={this.changeDuration}
              style={this.props.errorKeys.includes("duration") ? {borderColor: "red"} : null}
              name="duration"
              extra="dates"
              type="number"
              max={this.props.contract.dates.timeUnit === "months" ? 999 : 30}
            />
            <Input
              title="Unidade:"
              type="select"
              name="timeUnit"
              extra="dates"
              onChange={this.changeTimeUnit}
              value={this.props.contract.dates.timeUnit}>
                <option value="months">Meses</option>
                <option value="days">Dias</option>
            </Input>
            <Input
              title="Cidade:"
              name="city"
              type="text"
              extra="deliveryAddress"
              style={this.props.errorKeys.includes("city") ? {borderColor: "red"} : null}
              value={this.props.contract.deliveryAddress.city}
              onChange={this.handleChange}
            />
            <Input
              title="Estado:"
              type="select"
              name="state"
              extra="deliveryAddress"
              style={this.props.errorKeys.includes("state") ? {borderColor: "red"} : null}
              onChange={this.handleChange}
              value={this.props.contract.deliveryAddress.state}>
              {tools.states.map((item, i) => {
                return <option key={i} value={item}>{item}</option>
              })}
            </Input>
            <Input
              title="Número:"
              name="number"
              type="number"
              extra="deliveryAddress"
              style={this.props.errorKeys.includes("number") ? {borderColor: "red"} : null}
              value={this.props.contract.deliveryAddress.number}
              onChange={this.handleChange}
            />
            <Input
              title="Complemento:"
              name="additional"
              type="text"
              extra="deliveryAddress"
              value={this.props.contract.deliveryAddress.additional}
              onChange={this.handleChange}
            />
          </Block>
      )
  }
}