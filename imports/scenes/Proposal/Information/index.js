import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import CalendarBar from '/imports/components/CalendarBar/index';

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
    var firstChange = e.target.firstChange;
    var discount = 0;
    if (this.props.proposal.dates.timeUnit === "months") {
      if (duration >= 3 && duration <= 5) {
        discount = 0.15;
      } else if (duration >= 6 && duration <= 8) {
        discount = 0.2;
      } else if (duration >= 9 && duration <= 11) {
        discount = 0.25;
      } else if (duration >= 12) {
        discount = 0.3;
      }
    }
    var dates = {...this.props.proposal.dates};
    dates.duration = duration;
    this.props.updateProposal({
      dates,
      discount: firstChange ? this.props.proposal.discount : discount
    });
  }

  changeTimeUnit = (e) => {
    var timeUnit = e.target.value;
    var dates = {...this.props.proposal.dates};
    var firstChange = e.target.firstChange;
    var discount = 0;
    var observations = {
      ...this.props.proposal.observations,
      conditions: undefined
    }
    dates.duration = 1;
    dates.timeUnit = timeUnit;
    this.props.updateProposal({
      dates,
      discount: firstChange ? this.props.proposal.discount : discount,
      observations
    })
  }

  handleChange = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    var extra = e.target.extra;

    if (!extra) {
      this.props.updateProposal({[name]: value});
    } else {
      var obj = {...this.props.proposal[extra]};
      obj[name] = value;
      this.props.updateProposal({[extra]: obj});
    }
  }

  cepButtonClick = (data) => {
    if (!data.cep) return;
    var deliveryAddress = {
      ...this.props.proposal.deliveryAddress,
      street: data.logradouro,
      district: data.bairro,
      city: data.localidade,
      state: data.uf,
      number: '',
      additional: ''
    };
    this.props.updateProposal({ deliveryAddress });
  }

  render() {
      return (
          <Block
            className="proposal__information"
            columns={6}
            options={[
              {block: 4, span: 2},
              {block: 6, span: 0.5},
              {block: 7, span: 0.5},
              {block: 10, span: 0.5},
              {block: 11, span: 0.5}]}>
            <Input
              title="Nome do Cliente:"
              name="description"
              extra="client"
              type="text"
              error={this.props.errorKeys.includes("description")}
              value={this.props.proposal.client.description}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Nome do Contato:"
              name="name"
              extra="client"
              type="text"
              error={this.props.errorKeys.includes("name")}
              value={this.props.proposal.client.name}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Email:"
              name="email"
              extra="client"
              type="text"
              error={this.props.errorKeys.includes("email")}
              value={this.props.proposal.client.email}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Telefone:"
              name="phone"
              extra="client"
              type="text"
              error={this.props.errorKeys.includes("phone")}
              value={this.props.proposal.client.phone}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Rua / Bairro de Entrega:"
              name="street"
              type="text"
              extra="deliveryAddress"
              error={this.props.errorKeys.includes("street")}
              value={this.props.proposal.deliveryAddress.street}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <CalendarBar
              title="Data de Início:"
              name="startDate"
              extra="dates"
              onChange={this.handleChange}
              value={this.props.proposal.dates.startDate}
              disabled={this.props.disabled}
            />
            <Input
              title="Desconto:"
              name="discount"
              type="percent"
              error={this.props.errorKeys.includes("discount")}
              value={this.props.proposal.discount}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Duração:"
              value={this.props.proposal.dates.duration}
              onChange={this.changeDuration}
              error={this.props.errorKeys.includes("duration")}
              name="duration"
              extra="dates"
              type="number"
              min={1}
              max={this.props.proposal.dates.timeUnit === "months" ? 999 : 30}
              disabled={this.props.disabled}
            />
            <Input
              title="Unidade:"
              type="select"
              name="timeUnit"
              extra="dates"
              onChange={this.changeTimeUnit}
              disabled={this.props.disabled}
              value={this.props.proposal.dates.timeUnit}>
                <option value="months">Meses</option>
                <option value="days">Dias</option>
            </Input>
            <Input
              title="Cidade:"
              name="city"
              type="text"
              extra="deliveryAddress"
              error={this.props.errorKeys.includes("city")}
              value={this.props.proposal.deliveryAddress.city}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Estado:"
              type="select"
              name="state"
              extra="deliveryAddress"
              error={this.props.errorKeys.includes("state")}
              onChange={this.handleChange}
              disabled={this.props.disabled}
              value={this.props.proposal.deliveryAddress.state}>
              {tools.states.map((item, i) => {
                return <option key={i} value={item}>{item}</option>
              })}
            </Input>
            <Input
              title="Número:"
              name="number"
              type="number"
              extra="deliveryAddress"
              error={this.props.errorKeys.includes("number")}
              value={this.props.proposal.deliveryAddress.number}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Complemento:"
              name="additional"
              type="text"
              extra="deliveryAddress"
              value={this.props.proposal.deliveryAddress.additional}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
          </Block>
      )
  }
}