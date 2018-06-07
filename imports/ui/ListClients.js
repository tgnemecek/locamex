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
      const database = Clients.find().fetch();
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
                <td className="list-view__left-align list-view__small">Código</td>
                <td className="list-view__left-align">Nome Fantasia</td>
                <td className="list-view__right-align list-view__small"><ClientItem key={0} createNew={true}/></td>
              </tr>
              {this.state.database.map((client) => {
                return <ClientItem
                  key={client._id}
                  _id={client._id}
                  companyName={client.companyName}
                  officialName={client.officialName}
                  cnpj={client.cnpj}
                  registryES={client.registryES}
                  registryMU={client.registryMU}
                  formType={client.type}
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

      formType: this.props.formType,
      formTab: 1,

      companyName: this.props.companyName,
      officialName: this.props.officialName,
      cnpj: this.props.cnpj,
      registryES: this.props.registryES,
      registryMU: this.props.registryMU,
      contacts: this.props.contacts
    }

    this.tabContentsCompany = this.tabContentsCompany.bind(this);
    this.tabContentsContacts = this.tabContentsContacts.bind(this);

    this.openEditWindow = this.openEditWindow.bind(this);
    this.closeEditWindow = this.closeEditWindow.bind(this);
    this.openConfirmationWindow = this.openConfirmationWindow.bind(this);
    this.closeConfirmationWindow = this.closeConfirmationWindow.bind(this);
    this.closeWithRemoval = this.closeWithRemoval.bind(this);
    this.createNewClient = this.createNewClient.bind(this);
  };

  componentDidMount() {
    if (this.state.formType == 'company') {
      this.setState({ formTab: 0 });
    }
  }

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
    Meteor.call('clients.hide', this.props._id);
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

    var formArray = $("form.form--with-tabs").toArray();

    for (var i = 0; i < formArray.length; i++) {
      if (this.state.formType != 'company' || formArray[i] != formArray[0]) {
        var inputsArray = $("form.form--with-tabs")[i].find("input").toArray();
        for (var j = 0; j < inputsArray.length; j++) {
          inputsArray[j].value ? null : console.log('aaa');
        }
      }
    }

    let contactsArray = [];

    let clientObject = {};

    let description = this.refs.description.value.trim();
    let price = this.refs.price.value.trim();

    if (!description || !price) {
      this.setState({formError: 'Favor preencher todos os campos'})
      throw new Meteor.Error('required-fields-empty');
    };
    Meteor.call('clients.update', this.props._id, description, price);
    this.setState({ price });
    this.closeEditWindow();
  }

  createNewClient(e) {
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
    Meteor.call('clients.insert', description, price);
    this.closeEditWindow();
  }

  showCompanyTab() {
    if (this.state.formType == 'company') {
      return <button value={0} onClick={this.changeTab.bind(this)} className="active">Empresa</button>
    }
  }

  showAddNewTab() {
    if (this.state.contacts.length < 5) {
      return <button className="tablinks placeholder" onClick={this.newContactTab.bind(this)}>Novo Contato</button>
    }
  }

  newContactTab() {
    let contacts = this.state.contacts;
    contacts.push({
      "_id" : this.state.contacts.length,
      name: "",
      telephone: "",
      email: "",
      cpf: ""
    })
    this.setState({ contacts });
  }

  changeTab(e) {
    this.setState({ formTab: e.target.value });
    $("div.form__tab").find("button").removeClass("active");
    e.target.classList.add("active");

    var formArray = $("div.form--with-tabs").toArray();
    for (var i = 0; i < formArray.length; i++) {
      formArray[i].classList.add("hidden");
    }
    document.getElementsByClassName('form--with-tabs')[e.target.value].classList.remove("hidden");
  }

  showDeleteRegistry() {
    if (this.state.formTab > 0) {
      return <button className="button--delete-registry">Excluir Registro</button>
    }
  }

  updateStates() {
    this.setState({
      companyName: this.refs.companyName.value,
      officialName: this.refs.officialName.value,
      cnpj: this.refs.cnpj.value,
      registryES: this.refs.registryES.value,
      registryMU: this.refs.registryMU.value,
    });
  }

  changeRequiredFields() {
    if (this.state.formType == 'company') {
      $("div.form--with-tabs")[0].find("input").prop('required, true');////////////MELHORAR ESSA FUNCAO!
    } else {
      $("#company-form").find("input").prop('required, false');
    }
  }

  tabContentsCompany() {
    if (this.state.formType == 'company') {
      return(
        <div id="company-form" className="form--with-tabs" onSubmit={this.props.createNew ? this.props.createNewClient : this.props.saveEdits}>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Nome Fantasia:</label>
              <input type="text" ref="companyName" defaultValue={this.state.companyName} onChange={this.updateStates.bind(this)}/>
            </div>
            <div className="form__half-column-2of2">
              <label>CNPJ:</label>
              <input type="email" ref="cnpj" defaultValue={this.state.cnpj} onChange={this.updateStates.bind(this)}/>
            </div>
          </div>
          <div className="form__row">
            <label>Razão Social:</label>
            <input type="text" ref="officialName" defaultValue={this.state.officialName} onChange={this.updateStates.bind(this)}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Inscrição Estadual:</label>
              <input type="text" ref="registryES" defaultValue={this.state.registryES} onChange={this.updateStates.bind(this)}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Inscrição Municipal:</label>
              <input type="text" ref="registryMU" defaultValue={this.state.registryMU} onChange={this.updateStates.bind(this)}/>
            </div>
          </div>
        </div>
      )
    }
  }

  tabContentsContacts() {
    return this.state.contacts.map((contact) => {
      return(
        <div key={contact._id} className="form--with-tabs hidden">
          {this.showDeleteRegistry()}
          <div className="form__row">
            <label>Nome Completo:</label>
            <input type="text" defaultValue={contact.name}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>CPF:</label>
              <input type="text" defaultValue={contact.cpf}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Email:</label>
              <input type="email" defaultValue={contact.email}/>
            </div>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Telefone 1:</label>
              <input type="text" defaultValue={contact.telephone_1}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Telefone 2:</label>
              <input type="text" defaultValue={contact.telephone_2}/>
            </div>
          </div>
        </div>
      )
    })
  }

  editClientScreen(open, _id, description, price, createNew) {
    if (open) {
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
            <select defaultValue="company" ref="type" className="edit-clients__select-type" onChange={this.changeTab.bind(this)}>
              <option value="company">Pessoa Jurídica</option>
              <option value="person">Pessoa Física</option>
            </select>
            <div className="form__tab">
              {this.showCompanyTab()}
              {this.state.contacts.map((contact) => {
                  return <button key={contact._id} value={contact._id+1} onClick={this.changeTab.bind(this)}>Contato {(contact._id + 1)}</button>
                })}
              {this.showAddNewTab()}
            </div>
            <form onSubmit={this.props.createNew ? this.props.createNewClient : this.props.saveEdits}>
              {this.tabContentsCompany()}
              {this.tabContentsContacts()}
              {createNew ? null : <button type="button" className="button button--danger full-width" onClick={this.openConfirmationWindow}>Remover</button>}
              <div className="button__column1of2">
                <button type="button" className="button button--secondary" onClick={this.closeEditWindow}>Fechar</button>
              </div>
              <div className="button__column2of2">
                {createNew ? <button className="button button--primary">Criar</button> : <button className="button button--primary">Salvar</button>}
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
          {this.editClientScreen(this.state.editOpen, '', '', '', true)}
        </div>
      )
    } else {
      return (
          <tr>
            <td className="list-view__left-align">{this.props._id}</td>
            <td className="list-view__left-align">{this.props.name}</td>
            <td className="list-view__right-align list-view__edit"><button className="button--pill list-view__button" onClick={this.openEditWindow}>Editar</button></td>
            {this.editClientScreen(this.state.editOpen, this.props._id, this.props.description, this.props.price)}
          </tr>
      )
    }
  }
}