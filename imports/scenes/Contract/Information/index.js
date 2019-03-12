import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import { Clients } from '/imports/api/clients/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Calendar from '/imports/components/Calendar/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';

class Information extends React.Component {
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
    var months = e.target.value;
    var discount = 0;
    if (months === 1) {
      discount = 0;
    } else if (months > 1 && months <= 3) {
      discount = 0.2;
    } else if (months > 3 && months <= 6) {
      discount = 0.25;
    } else if (months > 6 && months <= 9) {
      discount = 0.3;
    } else if (months > 9 && months <= 12) {
      discount = 0.3;
    } else if (months > 12) {
      discount = 0.4;
    }
    var dates = {...this.props.contract.dates};
    dates.duration = months;
    this.props.updateContract({
      dates,
      discount
    });
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
              {block: 8, span: 0.5},
              {block: 9, span: 0.5}]}>
            <SuggestionBar
              title="Cliente:"
              name="client"
              database={this.props.clientsDatabase}
              style={this.props.errorKeys.includes("client") ? {borderColor: "red"} : null}
              value={this.props.contract.client}
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
              value={this.props.contract.startDate}
            />
            <Input
              title="Duração: (meses)"
              value={this.props.contract.dates.duration}
              onChange={this.changeDuration}
              style={this.props.errorKeys.includes("duration") ? {borderColor: "red"} : null}
              name="duration"
              extra="dates"
              type="number"
            />
            <Input
              title="Desconto: (%)"
              name="discount"
              type="number"
              max={100}
              style={this.props.errorKeys.includes("discount") ? {borderColor: "red"} : null}
              value={(this.props.contract.discount) * 100}
              onChange={(e) => this.handleChange({target: {value: tools.round((Number(e.target.value) / 100), 2), name: e.target.name}})}
            />
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

export default InformationWrapper = withTracker((props) => {
  Meteor.subscribe('clientsPub');
  var clientsDatabase = Clients.find().fetch({visible: true});
  var ready = !!clientsDatabase.length;
  return {
    clientsDatabase,
    ready
  }
})(Information)