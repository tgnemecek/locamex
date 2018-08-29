import React from 'react';
import moment from 'moment';

import { Clients } from '/imports/api/clients/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';
import tools from '/imports/startup/tools/index';

export default class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsDatabase: [],
      calendarOpen: false
    }
  }

  componentDidMount() {
    this.Tracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var clientsDatabase = Clients.find().fetch();
      this.setState({ clientsDatabase });
    });
  }

  selectClient = (e) => {
    this.props.updateContract(e.target.value, 'clientId');
  }

  clientOptions = () => {
    return this.state.clientsDatabase.map((client, i) => {
      return <option key={i} value={client._id}>{client.clientName}</option>
    })
  }

  toggleCalendar = (e) => {
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  handleChange = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    if (name == 'client') {
      this.props.updateContract(value, "clientId");
      return;
    }
    var extra = e.target.extra;
    var obj = {...this.props.contract[extra]};
    obj[name] = value;
    this.props.updateContract(obj, extra);
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
    this.props.updateContract(deliveryAddress, "deliveryAddress");
  }

  render() {
      return (
          <Block
            className="contract__information"
            columns={6}
            options={[{block: 0, span: 3}, {block: 1, span: 2}, {block: 3, span: 2}, {block: 6, span: 0.5}, {block: 7, span: 0.5}]}>
            <Input
              title="Cliente:"
              type="select"
              name="client"
              onChange={this.handleChange}>
              {this.clientOptions()}
            </Input>
            <Input
              title="Rua:"
              name="street"
              type="text"
              extra="deliveryAddress"
              value={this.props.contract.deliveryAddress.street}
              onChange={this.handleChange}
            />
            <Input
              title="CEP:"
              name="cep"
              type="cep"
              extra="deliveryAddress"
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
              value={this.props.contract.startDate}
            />
            <Input
              title="Duração: (meses)"
              value={this.props.contract.dates.duration}
              onChange={this.handleChange}
              name="duration"
              extra="dates"
              type="number"/>
            <Input
              title="Cidade:"
              name="city"
              type="text"
              extra="deliveryAddress"
              value={this.props.contract.deliveryAddress.city}
              onChange={this.handleChange}
            />
            <Input
              title="Estado:"
              type="select"
              name="state"
              extra="deliveryAddress"
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