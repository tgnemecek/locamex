import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '../startup/custom-types';
import PrivateHeader from './PrivateHeader';
import { Clients } from '../api/clients';
import ConfirmationMessage from './ConfirmationMessage';

export default class ListClients extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      database: []
    }
  };

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      const database = Clients.find({ visible: true }).fetch();
      this.setState({ database });
    })
  }

  render() {
    return (
      <div>
        <PrivateHeader title="Clientes"/>
        <div className="page-content">
          <table className="list-view__table">
            <tbody className="list-view__tbody">
              <tr>
                <th className="list-view__left-align list-view__small">Código</th>
                <th className="list-view__left-align">Nome Fantasia</th>
                <th className="list-view__right-align list-view__small"><ClientItem key={0} createNew={true}/></th>
              </tr>
              {this.state.database.map((client) => {
                return <ClientItem
                  key={client._id}
                  _id={client._id}
                  contacts={client.contacts}
                />
            })}
            </tbody>
          </table>
        </div>
      </div>
      )
  }
}

class ClientItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editOpen: false,
      confirmationWindow: false,
      formError: '',
      contacts: this.props.contacts,
      price: new Number(this.props.price)
    }
    this.openEditWindow = this.openEditWindow.bind(this);
    this.closeEditWindow = this.closeEditWindow.bind(this);
    this.openConfirmationWindow = this.openConfirmationWindow.bind(this);
    this.closeConfirmationWindow = this.closeConfirmationWindow.bind(this);
    this.closeWithRemoval = this.closeWithRemoval.bind(this);
    this.createNewService = this.createNewService.bind(this);
  };

  openEditWindow() {
    this.setState({editOpen: true});
  };

  closeEditWindow() {
    this.setState({
      editOpen: false,
      confirmationWindow: false
    });
  };

  closeWithRemoval() {
    Meteor.call('services.hide', this.props._id);
    this.setState({
      editOpen: false,
      confirmationWindow: false
    });
  };

  openConfirmationWindow() {
    this.setState({confirmationWindow: true});
  };

  closeConfirmationWindow() {
    this.setState({confirmationWindow: false});
  }

  removeSpecialCharacters(e) {
    let value = e.target.value;
    value = value.replace(/-./g, '');
  }

  saveEdits(e) {
    e.preventDefault();

    let description = this.refs.description.value.trim();
    let price = this.refs.price.value.trim();

    price = Number(price);

    if (!description || !price) {
      this.setState({formError: 'Favor preencher todos os campos'})
      throw new Meteor.Error('required-fields-empty');
    };
    Meteor.call('services.update', this.props._id, description, price);
    this.setState({ price });
    this.closeEditWindow();
  }

  createNewService(e) {
    e.preventDefault();

    let description = this.refs.description.value.trim();
    let price = this.refs.price.value.trim();

    price = Number(price);

    if (!description || !price) {
      this.setState({formError: 'Favor preencher todos os campos'})
      throw new Meteor.Error('required-fields-empty');
    }
    if (description.length > 40) {
      this.setState({formError: 'Limite de 40 caracteres excedido'})
      throw new Meteor.Error('string-too-long');
    }
    Meteor.call('services.insert', description, price);
    this.closeEditWindow();
  }

  editServiceScreen(open, _id, description, price, createNew) {
    if (open) {
      price = customTypes.formatReais(price, false);
      return(
        <ReactModal
          isOpen={true}
          className="boxed-view"
          contentLabel="Editar Serviço"
          appElement={document.body}
          onRequestClose={() => this.setState({editOpen: false})}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
          >
            {createNew ? <h2>Cadastrar Novo Cliente</h2> : <h2>Editar Cliente</h2>}
            {this.state.formError}
            <form onSubmit={createNew ? this.createNewService.bind(this) : this.saveEdits.bind(this)}>
              <div className="edit-services__main-div">
                <select defaultValue="company">
                  <option value="company">Pessoa Jurídica</option>
                  <option value="person">Pessoa Física</option>
                </select>
                <div className="tab">
                  <button className="tablinks" onclick="openCity(event, 'Paris')">Principal</button>
                  {() => {
                    this.state.contacts.map((contact) => {
                      return <button className="tablinks" onclick="openCity(event, 'London')">Contato #{contact.order}</button>
                    })
                  }}
                  <button className="tablinks" onclick="openCity(event, 'Paris')">+</button>
                </div>
                <div className="edit-services__main-div">
                  <label>Nome Fantasia:</label><input type="text" ref="description" defaultValue={description}/>
                  <label>Razão Social:</label><input type="text" ref="description" defaultValue={description}/>
                  <label>CNPJ:</label><input type="text" ref="description" defaultValue={description}/>
                  <label>Inscrição Estadual/Municipal:</label><input type="text" ref="description" defaultValue={description}/>
                </div>
                <div>
                  <label>Nome Completo:</label><input type="text" ref="description" defaultValue={description}/>
                  <label>Email:</label><input type="email" ref="description"/>
                  <label>Telefone:</label><input type="text" ref="description" defaultValue={description}/>
                  <label>CPF:</label><input type="text" ref="description" defaultValue={description}/>
                  <label>Cargo:</label><input type="text" ref="description" defaultValue={description}/>
                </div>
                {createNew ? null : <button type="button" className="button button--danger edit-services--remove" onClick={this.openConfirmationWindow}>Remover</button>}
              </div>
              <div className="button__main-div">
                <button type="button" className="button button--secondary" onClick={this.closeEditWindow}>Fechar</button>
                {createNew ? <button className="button">Criar</button> : <button className="button">Salvar</button>}
              </div>
            </form>
            {this.state.confirmationWindow ? <ConfirmationMessage
              title="Deseja excluir este serviço?"
              unmountMe={this.closeConfirmationWindow}
              confirmMe={this.closeWithRemoval}/> : null}
        </ReactModal>
      )
    }
  }

  render() {
    if(this.props.createNew) {
      return(
        <div>
          <button className="button--pill list-view__button" onClick={this.openEditWindow}>+</button>
          {this.editServiceScreen(this.state.editOpen, '', '', '', true)}
        </div>
      )
    } else {
      return (
          <tr>
            <td className="list-view__left-align">{this.props._id}</td>
            <td className="list-view__left-align">{this.props.description}</td>
            <td className="list-view__right-align list-view__edit"><button className="button--pill list-view__button" onClick={this.openEditWindow}>Editar</button></td>
            {this.editServiceScreen(this.state.editOpen, this.props._id, this.props.description, this.props.price)}
          </tr>
      )
    }
  }
}