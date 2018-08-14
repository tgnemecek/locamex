import React from 'react';
import moment from 'moment';

import { Clients } from '/imports/api/clients';

import CustomInput from '/imports/components/CustomInput/index';
import Calendar from '/imports/components/Calendar/index';
import customTypes from '/imports/startup/custom-types';

export default class Information extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientsDatabase: [],
      deliveryAddress: this.props.contract.deliveryAddress,
      calendarOpen: false,
      startDate: new Date(),
      invalidZip: false
    }
  }

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var clientsDatabase = Clients.find().fetch();
      this.setState({ clientsDatabase });
    });
  }

  selectClient = () => {
    return this.state.clientsDatabase.map((client, i) => {
      return <option key={i} value={client._id}>{client.clientName}</option>
    })
  }

  handleChangeAddress = (name, value) => {
    this.state.deliveryAddress[name] = value;
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

  setZip = (e) => {
    e.preventDefault();

    var value = e.target.value;
    this.state.deliveryAddress.zip = value;
    if (value.length == 8) {
      var object = customTypes.checkCEP(value, (data) => {
        if (data) {
          this.state.deliveryAddress.street = data.logradouro;
          this.state.deliveryAddress.district = data.bairro;
          this.state.deliveryAddress.city = data.localidade;
          this.state.deliveryAddress.state = data.uf;
          this.state.deliveryAddress.number = '';
          this.state.deliveryAddress.additional = '';
          this.setState({ invalidZip: false });
        } else {
          this.setState({ invalidZip: true });
          return;
        }
      });
    } else {
      if (value.length < 8) { this.setState({ invalidZip: true }) };
      if (value.length > 8) { this.setState({ invalidZip: true }) };
    }
    this.forceUpdate();
  }

  render() {
      return (
          <div className="contract__body--top">
            <div className="contract__item-wrap">
              <div style={{flexGrow: 1}}>
                <label>Cliente:</label>
                <select>
                  {this.selectClient()}
                </select>
              </div>
            </div>
            <div className="contract__item-wrap">
              <div className="contract__item-wrap--margin-right">
                <label>Endereço de Entrega:</label>
                <CustomInput name="street"
                  type="text"
                  value={this.state.deliveryAddress.street}
                  onChange={this.handleChangeAddress}/>
              </div>
              <div className="contract__item-wrap--force-small">
                <label>Número:</label>
                <CustomInput name="number"
                  type="number"
                  value={this.state.deliveryAddress.number}
                  onChange={this.handleChangeAddress}/>
              </div>
            </div>
            <div className="contract__item-wrap">
              <div className="contract__item-wrap--margin-right">
                <label>Data da Entrega:</label>
                <input readOnly value={moment(this.state.startDate).format("DD-MMMM-YYYY")}
                  onClick={this.toggleCalendar} style={{cursor: "pointer"}}/>
                {this.state.calendarOpen ? <Calendar
                                                closeCalendar={this.toggleCalendar}
                                                changeDate={this.changeDate}
                                                /> : null}
              </div>
              <div className="contract__item-wrap--margin-right">
                <label>Duração:</label>
                <input type="number"/>
              </div>
              <div>
                <label style={{visibility: "hidden"}}>Período:</label>
                <select>
                  <option value="months">meses</option>
                  <option value="days">dias</option>
                </select>
              </div>
            </div>
            <div className="contract__item-wrap">
              <div className="contract__item-wrap--margin-right">
                <label>Estado:</label>
                <select name="state" value={this.state.deliveryAddress.state} onChange={this.handleChangeAddress}>
                  {customTypes.states.map((item, i) => {
                    return <option key={i} value={item}>{item}</option>
                  })}
                </select>
              </div>
              <div className="contract__item-wrap--margin-right">
                <label>Complemento:</label>
                <CustomInput name="additional"
                  type="text"
                  value={this.state.deliveryAddress.additional}
                  onChange={this.handleChangeAddress}/>
              </div>
              <div>
                <label>CEP:</label>
                <CustomInput name="zip"
                  type="zip"
                  value={this.state.deliveryAddress.zip}
                  forceInvalid={this.state.invalidZip}
                  onChange={this.handleChangeAddress}/>
                <button className="contract__zip-button" value={this.state.deliveryAddress.zip} onClick={this.setZip}>↺</button>
              </div>
            </div>
          </div>
      )
  }
}