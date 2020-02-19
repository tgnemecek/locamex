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
    var discount = 0;
    if (this.props.snapshot.dates.timeUnit === "months") {
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
    var dates = {...this.props.snapshot.dates};
    dates.duration = duration;
    this.props.updateSnapshot({
      dates,
      discount
    });
  }

  changeTimeUnit = (e) => {
    var timeUnit = e.target.value;
    var dates = {...this.props.snapshot.dates};
    var discount = 0;
    var conditions = timeUnit === "months" ?
      this.props.settings
        .defaultConditionsMonths :
      this.props.settings
        .defaultConditionsDays

    var observations = {
      ...this.props.snapshot.observations,
      conditions
    }
    dates.duration = 1;
    dates.timeUnit = timeUnit;
    this.props.updateSnapshot({
      dates,
      discount,
      observations
    })
  }

  handleChange = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    var extra = e.target.extra;

    if (!extra) {
      this.props.updateSnapshot({[name]: value});
    } else {
      var obj = {...this.props.snapshot[extra]};
      obj[name] = value;
      this.props.updateSnapshot({[extra]: obj});
    }
  }

  cepButtonClick = (data) => {
    if (!data.cep) return;
    var deliveryAddress = {
      ...this.props.snapshot.deliveryAddress,
      street: data.logradouro,
      district: data.bairro,
      city: data.localidade,
      state: data.uf,
      number: '',
      additional: ''
    };
    this.props.updateSnapshot({ deliveryAddress });
  }

  render() {
      return (
        <div className="main-scene__information--proposal">
          <Input
            title="Nome do Cliente:"
            className="grid-span-2"
            name="description"
            extra="client"
            type="text"
            error={this.props.errorKeys.includes("description")}
            value={this.props.snapshot.client.description}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="Nome do Contato:"
            className="grid-span-2"
            name="name"
            extra="client"
            type="text"
            error={this.props.errorKeys.includes("name")}
            value={this.props.snapshot.client.name}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="Email:"
            className="grid-span-2"
            name="email"
            extra="client"
            type="text"
            error={this.props.errorKeys.includes("email")}
            value={this.props.snapshot.client.email}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="Telefone:"
            className="grid-span-2"
            name="phone"
            extra="client"
            type="text"
            error={this.props.errorKeys.includes("phone")}
            value={this.props.snapshot.client.phone}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="Rua / Bairro de Entrega:"
            className="grid-span-4"
            name="street"
            type="text"
            extra="deliveryAddress"
            error={this.props.errorKeys.includes("street")}
            value={this.props.snapshot.deliveryAddress.street}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <CalendarBar
            title="Data de Início:"
            className="grid-span-2"
            name="startDate"
            extra="dates"
            onChange={this.handleChange}
            value={this.props.snapshot.dates.startDate}
            disabled={this.props.disabled}
          />
          <Input
            title="Desconto:"
            name="discount"
            type="percent"
            error={this.props.errorKeys.includes("discount")}
            value={this.props.snapshot.discount}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="Duração:"
            value={this.props.snapshot.dates.duration}
            onChange={this.changeDuration}
            error={this.props.errorKeys.includes("duration")}
            name="duration"
            extra="dates"
            type="number"
            min={1}
            max={this.props.snapshot.dates.timeUnit === "months" ? 999 : 30}
            disabled={this.props.disabled}
          />
          <Input
            title="Unidade:"
            className="grid-span-2"
            type="select"
            name="timeUnit"
            extra="dates"
            onChange={this.changeTimeUnit}
            disabled={this.props.disabled}
            value={this.props.snapshot.dates.timeUnit}>
              <option value="months">Meses</option>
              <option value="days">Dias</option>
          </Input>
          <Input
            title="Cidade:"
            className="grid-span-2"
            name="city"
            type="text"
            extra="deliveryAddress"
            error={this.props.errorKeys.includes("city")}
            value={this.props.snapshot.deliveryAddress.city}
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
            value={this.props.snapshot.deliveryAddress.state}>
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
            value={this.props.snapshot.deliveryAddress.number}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="Complemento:"
            className="grid-span-2"
            name="additional"
            type="text"
            extra="deliveryAddress"
            value={this.props.snapshot.deliveryAddress.additional}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
        </div>
      )
  }
}