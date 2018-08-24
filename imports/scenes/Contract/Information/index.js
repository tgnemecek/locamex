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
      deliveryAddress: this.props.contract.deliveryAddress,
      calendarOpen: false,
      startDate: new Date()
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
    this.state.deliveryAddress[e.target.name] = e.target.value;
    this.forceUpdate();
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

  cepButtonClick = (data) => {
    var deliveryAddress = {...this.state.deliveryAddress};
    if (data) {
      deliveryAddress.street = data.logradouro;
      deliveryAddress.district = data.bairro;
      deliveryAddress.city = data.localidade;
      deliveryAddress.state = data.uf;
      // deliveryAddress.number = '';
      // deliveryAddress.additional = '';
    }
    this.setState({ deliveryAddress });
  }

  render() {
      return (
          <Block
            className="contract__body--top"
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
              value={this.state.deliveryAddress.street}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="Cidade:"
              name="city"
              type="text"
              value={this.state.deliveryAddress.city}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="CEP:"
              name="cep"
              type="cep"
              cepButtonClick={this.cepButtonClick}
              value={this.state.deliveryAddress.cep}
              forceInvalid={this.state.invalidZip}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="Data da Entrega:"
              type="calendar"
              calendarOpen={this.state.calendarOpen}
              toggleCalendar={this.toggleCalendar}
              changeDate={this.changeDate}
              value={this.state.startDate}
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
              onChange={this.handleChangeAddress}
              value={this.state.deliveryAddress.state}>
              {tools.states.map((item, i) => {
                return <option key={i} value={item}>{item}</option>
              })}
            </Input>
            <Input
              title="Número:"
              name="number"
              type="number"
              value={this.state.deliveryAddress.number}
              onChange={this.handleChangeAddress}
            />
            <Input
              title="Complemento:"
              name="additional"
              type="text"
              value={this.state.deliveryAddress.additional}
              onChange={this.handleChangeAddress}
            />
          </Block>
      )
  }
}