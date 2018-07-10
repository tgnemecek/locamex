import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '../startup/custom-types';

import { Clients } from '../api/clients';
import { Services } from '../api/services';

import CustomInput from './CustomInput';
import ConfirmationMessage from './ConfirmationMessage';

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
      products: this.props.products,

      clientsDatabase: [],
      productsDatabase: [],
      servicesDatabase: []
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

  render () {
    return (
      <form className="contract">
        <div className="contract__header">
          <div className="contract__overtitle">
            <p>Contrato criado por: <strong>Jurgen</strong></p>
          </div>
          <div className="contract__top-buttons">
            <button>⚠</button>
            <button>⎙</button>
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
            <div className="contract__item">
              <label>Cliente:</label>
              <select>
                {this.selectClient()}
              </select>
            </div>
            <div className="contract__item">
              <label>Endereço de Entrega:</label>
              <input type="text"/>
            </div>
            <div className="contract__item">
              <label>Calendário:</label>
              <select>
                {this.selectClient()}
              </select>
            </div>
            <div className="contract__item contract__item--address">
              <div>
                <label>Estado:</label>
                <select>
                  {this.selectClient()}
                </select>
              </div>
              <div>
                <label>Complemento:</label>
                <input type="text"/>
              </div>
              <div>
                <label>CEP:</label>
                <input type="number"/>
              </div>
            </div>
          </div>
          <div className="contract__body--top">

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
          <td>{customTypes.format(item.price, "reaisPrefix")}</td>
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