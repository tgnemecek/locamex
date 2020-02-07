import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';
import CalendarBar from '/imports/components/CalendarBar/index';

export default class Information extends React.Component {
  changeDuration = (e) => {
    var duration = e.target.value;
    var firstChange = e.target.firstChange;
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
      discount: firstChange ? this.props.snapshot.discount : discount,
      billingProducts: firstChange ? this.props.snapshot.billingProducts : [],
      billingServices: firstChange ? this.props.snapshot.billingServices : []
    });
  }

  changeTimeUnit = (e) => {
    var timeUnit = e.target.value;
    var dates = {...this.props.snapshot.dates};
    var discount = 0;
    var firstChange = e.target.firstChange;
    dates.duration = 1;
    dates.timeUnit = timeUnit;
    this.props.updateSnapshot({
      dates,
      discount: firstChange ? this.props.snapshot.discount : discount,
      billingProducts: firstChange ? this.props.snapshot.billingProducts : [],
      billingServices: firstChange ? this.props.snapshot.billingServices : []
    })
  }

  changeDeliveryDate = (e) => {
    var startDate = e.target.value;
    var firstChange = e.target.firstChange;
    this.props.updateSnapshot({
      dates: {
        ...this.props.snapshot.dates,
        startDate
      },
      billingProducts: firstChange ? this.props.snapshot.billingProducts : [],
      billingServices: firstChange ? this.props.snapshot.billingServices : []
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

  handleChangeClient = (e, client) => {
    this.props.updateSnapshot({ client });
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
        <div className="main-scene__information--contract">
          <SuggestionBar
            title="Cliente:"
            name="client"
            className="grid-span-4"
            disabled={this.props.disabled}
            database={this.props.clientsDatabase}
            fields={['description', 'registry']}
            error={this.props.errorKeys.includes("client")}
            value={this.props.snapshot.client._id}
            onClick={this.handleChangeClient}>
          </SuggestionBar>
          <Link
            className="grid-span-2"
            to={`/proposal/${this.props.contract.proposalId}`}
            style={{textDecoration: 'none', cursor: 'pointer'}}>
            <Input
              title="Proposta:"
              name="proposal"
              type="text"
              disabled={true}
              value={this.props.contract.proposalId + "." + (this.props.contract.proposalSnapshot+1)}
              onChange={this.handleChange}
            />
          </Link>
          <Input
            title="Endereço de Entrega:"
            name="street"
            type="text"
            className="grid-span-4"
            extra="deliveryAddress"
            error={this.props.errorKeys.includes("street")}
            value={this.props.snapshot.deliveryAddress.street}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="CEP:"
            name="cep"
            type="cep"
            className="grid-span-2"
            extra="deliveryAddress"
            error={this.props.errorKeys.includes("cep")}
            buttonClick={this.cepButtonClick}
            value={this.props.snapshot.deliveryAddress.cep}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <CalendarBar
            title="Início:"
            name="startDate"
            extra="dates"
            className="grid-span-2"
            disabled={this.props.disabled}
            onChange={this.changeDeliveryDate}
            value={this.props.snapshot.dates.startDate}
          />
          <Input
            title="Desconto:"
            name="discount"
            type="percent"
            disabled={this.props.disabled}
            error={this.props.errorKeys.includes("discount")}
            value={this.props.snapshot.discount}
            onChange={this.handleChange}
          />
          <Input
            title="Duração:"
            value={this.props.snapshot.dates.duration}
            onChange={this.changeDuration}
            disabled={this.props.disabled}
            error={this.props.errorKeys.includes("duration")}
            name="duration"
            extra="dates"
            type="number"
            min={1}
            max={this.props.snapshot.dates.timeUnit === "months" ? 999 : 30}
          />
          <Input
            title="Unidade:"
            type="select"
            name="timeUnit"
            extra="dates"
            className="grid-span-2"
            onChange={this.changeTimeUnit}
            disabled={this.props.disabled}
            value={this.props.snapshot.dates.timeUnit}>
              <option value="months">Meses</option>
              <option value="days">Dias</option>
          </Input>

          <Input
            title="Cidade:"
            name="city"
            type="text"
            className="grid-span-2"
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
            type="text"
            extra="deliveryAddress"
            error={this.props.errorKeys.includes("number")}
            value={this.props.snapshot.deliveryAddress.number}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
          <Input
            title="Complemento:"
            name="additional"
            type="text"
            className="grid-span-2"
            extra="deliveryAddress"
            value={this.props.snapshot.deliveryAddress.additional}
            onChange={this.handleChange}
            disabled={this.props.disabled}
          />
        </div>
      )
  }
}