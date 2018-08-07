import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactModal from 'react-modal';
import moment from 'moment';

import customTypes from '../startup/custom-types';
import pdfmake from '../client/pdfmake';

import { Clients } from '../api/clients';

import CustomInput from './CustomInput';
import ConfirmationMessage from './ConfirmationMessage';
import Calendar from './Calendar';
import ProductSelection from './ProductSelection';

export default class Contract extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      _id: this.props._id,
      clientId: this.props.clientId,
      type: this.props.type,
      status: this.props.status,
      createdBy: this.props.createdBy,
      creationDate: this.props.creationDate,
      startDate: this.props.startDate,
      duration: this.props.duration,
      observations: this.props.observations,
      deliveryAddress: this.props.deliveryAddress,
      billing: this.props.billing,

      products: [{ //HARD-CODED
        _id: '0000',
        name: 'Container LOCA 610 RSTC',
        price: 1500,
        quantity: 2,
        restitution: 30000
      }, {
        _id: '0055',
        name: 'Container LOCA 300',
        price: 500,
        quantity: 3,
        restitution: 20000
      }],
      services: [{
        _id: '0010',
        name: 'Movimentação',
        price: 3000,
        quantity: 2
      }, {
        _id: '0016',
        name: 'Acoplamento',
        price: 1000,
        quantity: 2
      }, {
        _id: '0099',
        name: 'Munck',
        price: 900,
        quantity: 1
      }],
      services: [],
      representatives: '',

      clientsDatabase: [],
      productsDatabase: [],
      servicesDatabase: [],

      containerSelectionOpen: false,
      accessoriesSelectionOpen: false,
      servicesSelectionOpen: false,
      calendarOpen: false,
      observationsOpen: false,
      documentsOpen: false,
      billingOpen: false,
      invalidZip: false
    }
  }

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var clientsDatabase = Clients.find().fetch();
      this.setState({ clientsDatabase });
    })
  }

  statusToJSX = () => {
    switch (this.state.status) {
      case "active":
        return <span className="contract--active">Ativo</span>
      case "inactive":
        return <span className="contract--inactive">Inativo</span>
      case "cancelled":
        return <span className="contract--cancelled">Cancelado</span>
      default:
        return "-";
    }
  }

  selectClient = () => {
    return this.state.clientsDatabase.map((client, i) => {
      return <option key={i} value={client._id}>{client.clientName}</option>
    })
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

  toggleDocuments = (e) => {
    e ? e.preventDefault() : null;
    var documentsOpen = !this.state.documentsOpen;
    this.setState({ documentsOpen });
  }

  toggleObservations = (e) => {
    e ? e.preventDefault() : null;
    var observationsOpen = !this.state.observationsOpen;
    this.setState({ observationsOpen });
  }

  toggleBilling = (e) => {
    e ? e.preventDefault() : null;
    var billingOpen = !this.state.billingOpen;
    this.setState({ billingOpen });
  }

  saveObservations = (observations) => {
    this.setState({ observations });
    this.toggleObservations();
  }

  checkIfHasContent = () => {
    return this.state.observations ? "content-inside" : "";
  }

  setRepresentatives = (representatives) => {
    this.setState({ representatives });
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
      if (value.length < 8) { this.setState({ invalidZip: false }) };
      if (value.length > 8) { this.setState({ invalidZip: true }) };
    }
    this.forceUpdate();
  }

  handleChangeAddress = (name, value) => {
    this.state.deliveryAddress[name] = value;
    this.forceUpdate();
  }

  toggleProductSelection = (database) => {
    if (this.state.containerSelectionOpen || this.state.accessoriesSelectionOpen || this.state.servicesSelectionOpen) {
      this.setState({ containerSelectionOpen: false });
      this.setState({ accessoriesSelectionOpen: false });
      this.setState({ servicesSelectionOpen: false });
    } else switch (database) {
      case 'containers':
        this.setState({ containerSelectionOpen: true });
        break;
      case 'accessories':
        this.setState({ accessoriesSelectionOpen: true });
        break;
      case 'services':
        this.setState({ servicesSelectionOpen: true });
        break;
    }
  }

  updateTable = (addedItems, database) => {
    switch (database) {
      case 'services':
        this.setState({ services: addedItems });
        break;
      case 'accessories':
        this.setState({ accessories: addedItems });
        break;
      case 'containers':
        this.setState({ containers: addedItems });
        break;
    }

  }

  render () {
    return (
      <form className="contract">
        <div className="contract__header">
          <div className="contract__overtitle">
            <p>Contrato criado por: <strong>Jurgen</strong></p>
          </div>
          <div className="contract__top-buttons">
            <button onClick={this.toggleObservations} className={this.checkIfHasContent()}>⚠</button>
            {this.state.observationsOpen ? <Observations
                                                  observations={this.state.observations}
                                                  closeObservations={this.toggleObservations}
                                                  saveObservations={this.saveObservations}
                                                  /> : null}
            <button onClick={this.toggleDocuments}>⎙</button>
            {this.state.documentsOpen ? <Documents
                                              closeDocuments={this.toggleDocuments}
                                              contractState={this.state}
                                              clientsDatabase={this.state.clientsDatabase}
                                              setRepresentatives={this.setRepresentatives}
                                              /> : null}
            <button onClick={this.toggleBilling}>$</button>
            {this.state.billingOpen ? <Billing
                                              closeBilling={this.toggleBilling}
                                              contractState={this.state}
                                              /> : null}
            <button>✖</button>
          </div>
          <div className="contract__title">
            <h1>Contrato #{this.props._id}</h1>
          </div>
          <div className="contract__subtitle">
            <h3>Status: {this.statusToJSX()}</h3>
          </div>
        </div>
        <div className="contract__body">
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
          <div className="contract__body--middle">
            <div className="contract__list">
              <label onClick={this.toggleProductSelection}>Containers:</label>
              <ContractList items={this.state.services} database="containers" onClick={this.toggleProductSelection}/>
              {this.state.containerSelectionOpen ? <ProductSelection
                                                    database="containers"
                                                    addedItems={this.state.containers}
                                                    saveEdits={this.updateTable}
                                                    closeProductSelection={this.toggleProductSelection}
                                                    /> : null}
            </div>
            <div className="contract__list">
              <label onClick={this.toggleProductSelection}>Acessórios:</label>
              <ContractList items={this.state.services} database="accessories" onClick={this.toggleProductSelection}/>
              {this.state.accessoriesSelectionOpen ? <ProductSelection
                                                    database="accessories"
                                                    addedItems={this.state.accessories}
                                                    saveEdits={this.updateTable}
                                                    closeProductSelection={this.toggleProductSelection}
                                                    /> : null}
            </div>
            <div className="contract__list">
              <label onClick={this.toggleProductSelection}>Serviços:</label>
              <ContractList items={this.state.services} database="services" onClick={this.toggleProductSelection}/>
              {this.state.servicesSelectionOpen ? <ProductSelection
                                                    database="services"
                                                    addedItems={this.state.services}
                                                    saveEdits={this.updateTable}
                                                    closeProductSelection={this.toggleProductSelection}
                                                    /> : null}
            </div>
          </div>
          <div className="contract__body--bottom">
            <button type="button" className="button button--secondary">Salvar Edições</button>
            <button type="button" className="button button--primary">Ativar Contrato</button>
            <div>
              <p>Contrato criado dia 12/12/2018</p>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

class ContractList extends React.Component {

  onClick = () => {
    this.props.onClick(this.props.database);
  }

  row = () => {
    return this.props.items.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item._id}</td>
          <td>{item.description}</td>
          <td>{customTypes.format(item.price, "currency")}</td>
          <td>{item.quantity}</td>
        </tr>
      )
    })
  }

  render() {
    if (this.props.items.length > 0) {
      return (
        <div className="contract__list-container" onClick={this.props.onClick}>
          <div className="contract__list__overlay"><div>✎</div></div>
          <table className="table table--contract">
            <tbody>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Qtd.</th>
              </tr>
              {this.row()}
            </tbody>
          </table>
        </div>

      )
    } else {
      return (
        <div className="contract__list-container" onClick={this.onClick}>
          <div className="contract__list__overlay"><div>+</div></div>
          <div>
            <strong>Lista Vazia.</strong>
          </div>
          <div>
            Clique aqui para adicionar o primeiro item.
          </div>
        </div>
      )
    }
  }
}

class Observations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      observations: this.props.observations
    }
  }

  onChange = (e) => {
    var observations = e.target.value;
    this.setState({ observations });
  }

  saveEdits = () => {
    this.props.saveObservations(this.state.observations);
  }

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Observações"
          appElement={document.body}
          onRequestClose={this.props.closeObservations}
          className="observations"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeObservations} className="button--close-box">✖</button>
              <div className="observations__header">
                <h3>Observações:</h3>
              </div>
              <div className="observations__body">
                <textarea value={this.state.observations} onChange={this.onChange}/>
              </div>
              <div className="observations__footer">
                <button type="button" className="button button--primary" onClick={this.saveEdits}>OK</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}

class Documents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      document: '',
      representatives: ''
    }
  }

  representativesOnChange = (e) => {
    var representatives = e.target.value;
    this.setState({ representatives });
  }

  generate = (e) => {
    var clients = this.props.clientsDatabase;
    var print = {
      contractInfo: {
        _id: this.props.contractState._id,
        startDate: this.props.contractState.startDate,
        duration: this.props.contractState.duration,
        deliveryAddress: {
          number: 1212,
          street: 'Rua Sonia Ribeiro',
          zip: '04621010',
          district: 'Campo Belo',
          city: 'São Paulo',
          state: 'SP',
        },
        products: [{
          _id: '0000',
          name: 'Container LOCA 610 RSTC',
          price: 1500,
          quantity: 2,
          restitution: 30000
        }, {
          _id: '0055',
          name: 'Container LOCA 300',
          price: 500,
          quantity: 3,
          restitution: 20000
        }],
        services: [{
          _id: '0010',
          name: 'Movimentação',
          price: 3000,
          quantity: 2
        }, {
          _id: '0016',
          name: 'Acoplamento',
          price: 1000,
          quantity: 2
        }, {
          _id: '0099',
          name: 'Munck',
          price: 900,
          quantity: 1
        }]
      },
      clientInfo: {},
      billingInfo: {},
    }
    for (var i = 0; i < clients.length; i++) {
      if (clients[i]._id == this.props.contractState.clientId) {
        print.clientInfo = clients[i];
      }
    }
    var seller = {
      contact: 'Nome do Vendedor',
      phone: '(11) 94514-8263',
      email: 'tgnemecek@gmail.com'
    };
    var representatives = [{
      name: 'Alonso Pinheiro',
      cpf: 44097844533,
      rg: 358520319
    }, {
      name: 'Alonso Pinheiro',
      cpf: 44097844533,
      rg: 358520319
    }]
    console.log(print, seller, representatives);
    pdfmake(print, seller, representatives);
  }

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Emitir Documentos"
          appElement={document.body}
          onRequestClose={this.props.closeDocuments}
          className="documents"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeDocuments} className="button--close-box">✖</button>
              <div className="documents__header">
                <h3>Emitir Documentos:</h3>
              </div>
              <div className="documents__body">
                <div>
                  <label>Documento:</label>
                  <select>
                    <option value="proposal-long">Contrato</option>
                    <option value="invoice-sending">Nota Fiscal de Remessa</option>
                  </select>
                </div>
                <div>
                  <label>Representante Legal:</label>
                  <select onChange={this.representativesOnChange}>
                    <option value={{_id: 0, contactId: 123}}>Nomeeee Sobrenome</option>
                  </select>
                </div>
                <div>
                  <label>Segundo Representante: (opcional)</label>
                  <select onChange={this.representativesOnChange}>
                    <option value={{_id: 0, contactId: 123}}>Nomeeee Sobrenome</option>
                  </select>
                </div>
              </div>
              <div className="documents__footer">
                <button type="button" className="button button--primary" onClick={this.generate}>Gerar</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}

class Billing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charges: [],
      equalDivision: true,
      difference: 0,
      valid: false,
      calendarOpen: false,
      startDate: new Date()
    }
    this.totalValue = this.props.contractState.products.reduce((acc, current) => {
      return {
        price: acc.price + current.price
      }
    }).price;
    this.inputValues = [];
  }

  representativesOnChange = (e) => {
    var representatives = e.target.value;
    this.setState({ representatives });
  }

  divisionChange = (e) => {
    var equalDivision = e.target.checked;
    this.setState({ equalDivision });
  }

  inputFormat = (name, value, id, valid) => {
    var charges = this.state.charges;
    charges[name].price = value;
    this.setState({ charges });
  }

  updateTable = (name, value) => {
    value = Number(value);
    var charges = JSON.parse(JSON.stringify(this.state.charges));
    var newCharges = [];
    var difference = Math.abs(charges.length - value);
    if (value > charges.length) {
      for (var i = 0; i < difference; i++) {
        newCharges.push({
          description: `Cobrança #${i +  charges.length + 1} referente ao Valor Total do Contrato`,
          value: ''
        })
      }
      charges = charges.concat(newCharges);
      this.setState({ charges });
    }
    if (value < charges.length) {
      for (var i = 0; i < value; i++) {
        newCharges.push(charges[i]);
      }
      this.setState({ charges: newCharges });
    }
  }

  onChange = (name, value, id) => {
    this.inputValues[name] = value;
    var total = this.inputValues.reduce((acc, current) => acc + current);
    var difference = total - this.totalValue;
    this.setState({
      difference,
      valid: !difference
    });
  }

  updateDescription = (e) => {
    var charges = this.state.charges;
    charges[e.target.name].description = e.target.value;
    this.setState({ charges });
  }

  renderBody = () => {
    var equalValue = customTypes.round(this.totalValue / this.state.charges.length, 2);
    var equalValueStr;
    var rest = customTypes.round(this.totalValue - (equalValue * this.state.charges.length), 2);
    return this.state.charges.map((charge, i, array) => {
      var moment1 = moment(this.state.startDate).add((30 * i + i), 'days');
      var moment2 = moment(this.state.startDate).add((30 * i + 30 + i), 'days');
      if (i == 0) {
        equalValueStr = customTypes.format(equalValue + rest, "currency");
      } else {
        equalValueStr = customTypes.format(equalValue, "currency");
      }
      return (
        <tr key={i}>
          <td>{(i + 1) + '/' + array.length}</td>
          <td>{moment1.format("DD-MM-YY") + ' a ' +  moment2.format("DD-MM-YY")}</td>
          <td>{moment2.format("DD-MM-YY")}</td>
          <td><textarea name={i} value={charge.description} onChange={this.updateDescription}/></td>
          <td>{this.state.equalDivision ? equalValueStr : <CustomInput name={i} type="currency"
                                                              onChange={this.onChange}
                                                              placeholder={equalValueStr}
                                                              />}</td>
        </tr>
      )
    })
  }

  calcDifference = () => {
    var value = customTypes.format(this.state.difference, 'currency');
    var className = this.state.difference != 0 ? "difference--danger" : "difference--zero";
    return <span className={className}>{value}</span>
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

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Emitir Documentos"
          appElement={document.body}
          onRequestClose={this.props.closeBilling}
          className="billing"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeBilling} className="button--close-box">✖</button>
              <div className="billing__header">
                <h3>Tabela de Cobrança:</h3>
              </div>
              <div className="billing__body">
                <div className="billing__item">
                  <label>Número de Cobranças:</label>
                  <CustomInput
                    type="number"
                    value={this.state.charges.length}
                    onChange={this.updateTable}/>
                </div>
                <div className="billing__item">
                  <label>Início da Cobrança:</label>
                  <input readOnly value={moment(this.state.startDate).format("DD-MMMM-YYYY")}
                    onClick={this.toggleCalendar} style={{cursor: "pointer"}}/>
                  {this.state.calendarOpen ? <Calendar
                                                closeCalendar={this.toggleCalendar}
                                                changeDate={this.changeDate}/> : null}
                </div>
                <div>
                  <label>Parcelas iguais:</label>
                  <input type="checkbox" checked={this.state.equalDivision} onChange={this.divisionChange}/>
                </div>
                <div>
                  <table className="table table--billing">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Período</th>
                        <th>Vencimento</th>
                        <th>Descrição da Cobrança</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderBody()}
                    </tbody>
                    <tfoot>
                      <tr style={this.state.equalDivision ? {display: 'none'} : {display: 'inherit'}}>
                        <td colSpan="4" style={{fontStyle: "italic"}}>Diferença:</td>
                        <td>{this.calcDifference()}</td>
                      </tr>
                      <tr>
                        <th colSpan="4"><b>Valor Total do Contrato:</b></th>
                        <th>{customTypes.format(this.totalValue, "currency")}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="billing__footer">
                <button type="button" className="button button--primary" onClick={this.saveEdits}>Salvar</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}