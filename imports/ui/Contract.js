import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactModal from 'react-modal';
import moment from 'moment';

import customTypes from '../startup/custom-types';
import pdfmake from '../client/pdfmake';

import { Clients } from '../api/clients';
import { Services } from '../api/services';

import CustomInput from './CustomInput';
import ConfirmationMessage from './ConfirmationMessage';
import Calendar from './Calendar';

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
              <label>Serviços:</label>
              <ContractList database="services"/>
            </div>
            <div className="contract__list">
              <label>Containers:</label>
              <ContractList database="containers"/>
            </div>
            <div className="contract__list">
              <label>Acessórios:</label>
              <ContractList database="accessories"/>
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
  constructor(props) {
    super(props);
    this.state = {
      database: [],
      added: []
    }
  }

  componentDidMount() {
    var publication = '';
    var database = [];

    this.servicesTracker = Tracker.autorun(() => {
      switch(this.props.database) {
        case "services":
          publication = 'servicesPub';
          database = Services.find().fetch();
          break;
        case "containers":
          // publication = 'containersPub';
          // database = Containers.find().fetch();
          break;
        case "accessories":
          // publication = 'accessoriesPub';
          // database = Accessories.find().fetch();
          break;
      }
      Meteor.subscribe('servicesPub');
      this.setState({ database });
    })
  }

  addNew = () => {
    alert('added');
  }

  quantity = () => {
    return <input type="number" defaultValue="1"/>
  }

  row = () => {
    return this.state.database.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item._id}</td>
          <td>{item.description}</td>
          <td>{customTypes.format(item.price, "currency")}</td>
          <td>{this.quantity()}</td>
        </tr>
      )
    })
  }

  render() {
    if (this.state.added) {
      return (
        <div className="contract__list-container">
          <table className="table-main table-contract">
            <tbody>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Quantidade</th>
              </tr>
              {this.row()}
            </tbody>
          </table>
        </div>

      )
    } else {
      return (
        <div className="contract__list-container" onClick={this.addNew}>
          <p><strong>Lista Vazia. </strong>Clique para adicionar o primeiro item.</p>
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
          className="contract__box-view"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeObservations} className="button--close-box">✖</button>
              <div className="contract__box-view--header">
                <h3>Observações:</h3>
              </div>
              <div className="contract__box-view--body">
                <textarea value={this.state.observations} onChange={this.onChange}/>
              </div>
              <div className="contract__box-view--footer">
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
    // var print = {
    //   // Company Information
    //   // clientName: '',
    //   // clientType: '',
    //   // cpfCnpj: '',
    //   // registry: '',
    //   // typeOfregistry: '', // MU or ES
    //   // clientAddress: '',
    //
    //   // Contract General Information
    //   // Contract Address
    //
    //   phone: '',
    //   email: '',
    //   representative: [//Name, CPF, RG
    //     {},{}
    //   ],
    //   products: [
    //     {}, {}
    //   ],
    //   services: [
    //     {}, {}
    //   ],
    //   startingDate: '',
    //   endingDate: '',
    //   period: '',
    //   billing: {
    //     totalCharges: '',
    //     startingChargeDate: '',
    //     charges: [{
    //       number: '',
    //       description: '',
    //       value: ''
    //     }]
    //   },
    //   witnessNumber: 2
    // }
    // this.props.setRepresentatives();
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
          className="contract__box-view contract__box-view--documents"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeDocuments} className="button--close-box">✖</button>
              <div className="contract__box-view--header">
                <h3>Emitir Documentos:</h3>
              </div>
              <div className="contract__box-view--body">
                <div>
                  <select>
                    <option value="proposal-long">Proposta Longo Prazo</option>
                    <option value="proposal-short">Proposta Curto Prazo</option>
                    <option value="contract-short">Contrato Longo Prazo</option>
                    <option value="contract-long">Contrato Curto Prazo</option>
                    <option value="invoice-sending">Nota Fiscal de Remessa</option>
                  </select>
                </div>
                <div>
                  <select onChange={this.representativesOnChange}>
                    <option value={{_id: 0, contactId: 123}}></option>
                  </select>
                  <label className="radio-button-container">
                    <input type="radio" name="format" value="word"/>
                    <span className="checkmark"></span>
                    Word
                  </label>
                  <label className="radio-button-container">
                    <input type="radio" name="format" value="pdf"/>
                    <span className="checkmark"></span>
                    PDF
                  </label>
                </div>
              </div>
              <div className="contract__box-view--footer">
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
      valid: false
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
          startDate: '',
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
    var difference = this.totalValue - total;
    this.setState({
      difference,
      valid: !difference
    });
  }

  renderBody = () => {
    var equalValue = customTypes.round(this.totalValue / this.state.charges.length, 2);
    var equalValueStr;
    var rest = customTypes.round(this.totalValue - (equalValue * this.state.charges.length), 2);
    return this.state.charges.map((charge, i, array) => {
      if (i == 0) {
        equalValueStr = customTypes.format(equalValue + rest, "currency")
      } else equalValueStr = customTypes.format(equalValue, "currency");
      return (
        <tr key={i}>
          <td>{(i + 1) + '/' + array.length}</td>
          <td>{charge.startDate}</td>
          <td>{charge.startDate}</td>
          <td>{charge.description}</td>
          <td>{this.state.equalDivision ? equalValueStr : <CustomInput name={i} type="currency"
                                                              onChange={this.onChange}
                                                              placeholder={equalValueStr}
                                                              />}</td>
        </tr>
      )
    })
  }

  calcDifference = () => {
    return customTypes.format(this.state.difference, 'currency');
  }

  render() {
      return (
        <ReactModal
          isOpen={true}
          contentLabel="Emitir Documentos"
          appElement={document.body}
          onRequestClose={this.props.closeBilling}
          className="contract__box-view contract__box-view--billing"
          overlayClassName="boxed-view boxed-view--modal"
          >
            <div>
              <button onClick={this.props.closeBilling} className="button--close-box">✖</button>
              <div className="contract__box-view--header">
                <h3>Tabela de Cobrança:</h3>
              </div>
              <div className="contract__box-view--body">
                <div>
                  <label>Número de Cobranças:</label>
                  <CustomInput
                    type="number"
                    value={this.state.charges.length}
                    onChange={this.updateTable}/>
                </div>
                <div>
                  <label>Parcelas iguais:</label>
                  <input type="checkbox" checked={this.state.equalDivision} onChange={this.divisionChange}/>
                </div>
                <div>
                  <table className="table-main table-billing">
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
                        <td colSpan="4" style={{fontStyle: "italic"}}>Restante:</td>
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
              <div className="contract__box-view--footer">
                <button type="button" className="button button--primary" onClick={this.saveEdits}>Salvar</button>
              </div>
            </div>
        </ReactModal>
      )
  }
}