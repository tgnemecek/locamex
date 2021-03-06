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
    if (this.props.contract.dates.timeUnit === "months") {
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
    var dates = {...this.props.contract.dates};
    dates.duration = duration;
    this.props.updateContract({
      dates,
      discount: firstChange ? this.props.contract.discount : discount,
      billingProducts: firstChange ? this.props.contract.billingProducts : [],
      billingServices: firstChange ? this.props.contract.billingServices : []
    });
  }

  changeTimeUnit = (e) => {
    var timeUnit = e.target.value;
    var dates = {...this.props.contract.dates};
    var discount = 0;
    var firstChange = e.target.firstChange;
    dates.duration = 1;
    dates.timeUnit = timeUnit;
    this.props.updateContract({
      dates,
      discount: firstChange ? this.props.contract.discount : discount,
      billingProducts: firstChange ? this.props.contract.billingProducts : [],
      billingServices: firstChange ? this.props.contract.billingServices : []
    })
  }

  changeDeliveryDate = (e) => {
    var startDate = e.target.value;
    var firstChange = e.target.firstChange;
    this.props.updateContract({
      dates: {
        ...this.props.contract.dates,
        startDate
      },
      billingProducts: firstChange ? this.props.contract.billingProducts : [],
      billingServices: firstChange ? this.props.contract.billingServices : []
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
        <div className="contract__information">
          <div className="contract__information__left">
            <SuggestionBar
              title="Cliente:"
              name="clientId"
              className="span4"
              disabled={this.props.disabled}
              database={this.props.clientsDatabase}
              fields={['description', 'registry']}
              error={this.props.errorKeys.includes("clientId")}
              value={this.props.contract.clientId}
              onClick={this.handleChange}>
            </SuggestionBar>
            <Link
              className="span2"
              to={`/proposal/${this.props.contract.proposal}`}
              style={{textDecoration: 'none', cursor: 'pointer'}}>
              <Input
                title="Proposta:"
                name="proposal"
                type="text"
                disabled={true}
                value={this.props.contract.proposal + "." + (this.props.contract.proposalVersion+1)}
                onChange={this.handleChange}
              />
            </Link>
            <CalendarBar
              title="Início:"
              name="startDate"
              extra="dates"
              className="span2"
              disabled={this.props.disabled}
              onChange={this.changeDeliveryDate}
              value={this.props.contract.dates.startDate}
            />
            <Input
              title="Desconto:"
              name="discount"
              type="percent"
              disabled={this.props.disabled}
              error={this.props.errorKeys.includes("discount")}
              value={this.props.contract.discount}
              onChange={this.handleChange}
            />
            <Input
              title="Duração:"
              value={this.props.contract.dates.duration}
              onChange={this.changeDuration}
              disabled={this.props.disabled}
              error={this.props.errorKeys.includes("duration")}
              name="duration"
              extra="dates"
              type="number"
              min={1}
              max={this.props.contract.dates.timeUnit === "months" ? 999 : 30}
            />
            <Input
              title="Unidade:"
              type="select"
              name="timeUnit"
              extra="dates"
              className="span2"
              onChange={this.changeTimeUnit}
              disabled={this.props.disabled}
              value={this.props.contract.dates.timeUnit}>
                <option value="months">Meses</option>
                <option value="days">Dias</option>
            </Input>
          </div>
          <div className="contract__information__right">
            <Input
              title="Endereço de Entrega:"
              name="street"
              type="text"
              className="span4"
              extra="deliveryAddress"
              error={this.props.errorKeys.includes("street")}
              value={this.props.contract.deliveryAddress.street}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="CEP:"
              name="cep"
              type="cep"
              className="span2"
              extra="deliveryAddress"
              error={this.props.errorKeys.includes("cep")}
              buttonClick={this.cepButtonClick}
              value={this.props.contract.deliveryAddress.cep}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />

            <Input
              title="Cidade:"
              name="city"
              type="text"
              className="span2"
              extra="deliveryAddress"
              error={this.props.errorKeys.includes("city")}
              value={this.props.contract.deliveryAddress.city}
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
              value={this.props.contract.deliveryAddress.state}>
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
              value={this.props.contract.deliveryAddress.number}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
            <Input
              title="Complemento:"
              name="additional"
              type="text"
              className="span2"
              extra="deliveryAddress"
              value={this.props.contract.deliveryAddress.additional}
              onChange={this.handleChange}
              disabled={this.props.disabled}
            />
          </div>
        </div>
      )
  }
}