import React from 'react';
import moment from 'moment';

import { Clients } from '/imports/api/clients';

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
      // deliveryAddress: this.props.contract.deliveryAddress,
      // startDate: new Date()
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

  handleChangeAddress = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    var deliveryAddress = {...this.props.contract.deliveryAddress};
    deliveryAddress[name] = value;
    this.props.updateContract(deliveryAddress, "deliveryAddress");
  }

  toggleCalendar = (e) => {
    var calendarOpen = !this.state.calendarOpen;
    this.setState({ calendarOpen });
  }

  changeDate = (startDate) => {
    this.props.updateContract(startDate, "startDate");
  }

  cepButtonClick = (data) => {
    var deliveryAddress = {...this.props.contract.deliveryAddress};
    if (data) {
      deliveryAddress.street = data.logradouro;
      deliveryAddress.district = data.bairro;
      deliveryAddress.city = data.localidade;
      deliveryAddress.state = data.uf;
      // deliveryAddress.number = '';
      // deliveryAddress.additional = '';
    }
    this.props.updateContract(deliveryAddress, "deliveryAddress");
  }

  render() {
      return (
          <Block
            className="contract__information"
            columns={6}
            options={[{block: 0, span: 3}]}>
            <Input
              title="Cliente:"
              type="select"
              onChange={this.selectClient}>
              {this.clientOptions()}
            </Input>
            <Input
              title="Rua:"
              name="street"
              type="text"
              value={this.props.contract.deliveryAddress.street}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="Cidade:"
              name="city"
              type="text"
              value={this.props.contract.deliveryAddress.city}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="CEP:"
              name="cep"
              type="cep"
              buttonClick={this.cepButtonClick}
              value={this.props.contract.deliveryAddress.cep}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="Data da Entrega:"
              type="calendar"
              calendarOpen={this.state.calendarOpen}
              toggleCalendar={this.toggleCalendar}
              changeDate={this.changeDate}
              value={this.props.contract.startDate}
            />
            <Input title="Duração:" type="number"/>
            <Input
              title="Unidade:"
              type="select"
              onChange={this.selectClient}>
              <option value="months">Meses</option>
              <option value="days">Dias</option>
            </Input>
            <Input
              title="Estado:"
              type="select"
              name="state"
              onChange={this.handleChangeAddress}
              value={this.props.contract.deliveryAddress.state}>
              {tools.states.map((item, i) => {
                return <option key={i} value={item}>{item}</option>
              })}
            </Input>
            <Input
              title="Número:"
              name="number"
              type="number"
              value={this.props.contract.deliveryAddress.number}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="Complemento:"
              name="additional"
              type="text"
              value={this.props.contract.deliveryAddress.additional}
              onChange={this.handleChangeAddress}
            />
          </Block>
      )
  }
}