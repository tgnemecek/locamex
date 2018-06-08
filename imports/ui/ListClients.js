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
    this.renderClients = this.renderClients.bind(this);
  };

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      const database = Clients.find().fetch();
      this.setState({ database });
    })
  }

  renderClients() {
    if (this.state.database.length > 0) {
      return this.state.database.map((client) => {
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
      })
    }
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
              {this.renderClients()}
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
      confirmationMessage: '',
      formError: '',
      isError: false,

      requiredFieldsProposal: [],
      requiredFieldsContract: [],

      formType: this.props.formType,
      formTab: 1,

      contacts: []
    }

    this.tabContentsCompany = this.tabContentsCompany.bind(this);
    this.tabContentsContacts = this.tabContentsContacts.bind(this);
    this.renderError = this.renderError.bind(this);

  };

  componentDidMount() {

    var contacts = [];
    if (this.props.contacts) {
      for (var i = 0; i < this.props.contacts.length; i++) {
        contacts[i] = this.props.contacts[i];
      }
    }
    this.setState({ contacts });

    if (this.state.formType == 'company') {
      this.setState({ formTab: 0 });
    } else {
      this.setState({ formTab: 1 });
    }
  }

  openEditWindow() {
    this.setState({editOpen: true});
  };

  closeEditWindow() {
    var contacts = [];
    for (var i = 0; i < this.props.contacts.length; i++) {
      contacts[i] = this.props.contacts[i];
    }

    this.setState({
      editOpen: false,
      confirmationWindow: false,
      contacts
    });
  };

  closeWithRemoval() {
    Meteor.call('clients.hide', this.props._id);
    this.setState({
      editOpen: false,
      confirmationWindow: false
    });
  };

  closeConfirmationWindow() {
    this.setState({confirmationWindow: false});
  }

  removeSpecialCharacters(e) {
    let value = e.target.value;
    value = value.replace(/-./g, '');
  }

  renderError() {
    if (this.state.isError) {
      var formErrorMessage = [];

      for (var i = 0; i < this.state.formError.length; i++) {
        formErrorMessage.push(this.state.formError[i]);
      }
      if (formErrorMessage.length > 1){
        formErrorMessage.unshift("Favor preencher os seguintes campos obrigatórios: ")
      }
      if (formErrorMessage.length == 1){
        formErrorMessage.unshift("Favor preencher o seguinte campo obrigatório: ")
      }
      return formErrorMessage.map((line) => {
        return <h3 key={line} className="error-message">{line}</h3>
      })
    } else { return null };
  }

  openConfirmationWindow(e) {
    e.preventDefault();

    var requiredFieldsProposal = [];
    var requiredFieldsContract = [];
    var formError = [];
    var confirmationMessage = [];

    this.setState({ isError: false });

    if (this.state.formType == 'company') {
      requiredFieldsProposal = [
        this.refs.companyName,
        this.refs.contactName_0,
        this.refs.contactEmail_0,
        this.refs.contactPhone1_0
      ];
      requiredFieldsContract = [
        this.refs.companyName,
        this.refs.officialName,
        this.refs.cnpj,
        this.refs.registryES,
        this.refs.registryMU,

        this.refs.contactName_0,
        this.refs.contactCPF_0,
        this.refs.contactEmail_0,
        this.refs.contactPhone1_0
      ];
    } else {
      requiredFieldsProposal = [
        this.refs.contactName_0,
        this.refs.contactEmail_0,
        this.refs.contactPhone1_0
      ];
      requiredFieldsContract = [
        this.refs.contactName_0,
        this.refs.contactCPF_0,
        this.refs.contactEmail_0,
        this.refs.contactPhone1_0
      ];
    }

    for (var i = 0; i < requiredFieldsProposal.length; i++) {
      requiredFieldsProposal[i].value.trim();

      if (requiredFieldsProposal[i].value == '') {
        formError.push(requiredFieldsProposal[i].name);
        this.setState({ isError: true, formError });
      }
    }

    if (formError.length > 0) {
      return;
    }

    for (var i = 0; i < requiredFieldsContract.length; i++) {
      requiredFieldsContract[i].value.trim();

      if (!requiredFieldsContract[i].value) {
        confirmationMessage.push({
          key: i + 3,
          text: "-" + requiredFieldsContract[i].name,
        });
      }
    }

    if (confirmationMessage.length == 0) {
      console.log(requiredFieldsProposal.length);
      this.saveEdits();
      return;
    }

    confirmationMessage.unshift({
      key: 2,
      text: 'Campos inválidos:'
    });
    confirmationMessage.unshift({
      key: 1,
      text: 'Deseja continuar mesmo assim?'
    });
    confirmationMessage.unshift({
      key: 0,
      text: 'Atenção: O formulário contém campos inválidos obrigatórios para a emissão de contrato.'
    });

    this.setState({ confirmationMessage });
    this.setState({ confirmationWindow: true });
  }

  saveEdits(e) {

    var allFields = [
      this.refs.companyName,
      this.refs.officialName,
      this.refs.cnpj,
      this.refs.registryES,
      this.refs.registryMU];

      for (var i = 0; i < this.state.contacts.length; i++) {

      }

    // Meteor.call('clients.update', this.props._id, description, price);
    // this.setState({ price });
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
    this.closeEditWindow.bind(this)();
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
        <div id="company-form" className="form--with-tabs" onSubmit={this.props.createNew ? this.props.createNew : this.props.saveEdits}>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Nome Fantasia:</label>
              <input name="Nome Fantasia" type="text" ref="companyName" defaultValue={this.props.companyName}/>
            </div>
            <div className="form__half-column-2of2">
              <label>CNPJ:</label>
              <input name="CNPJ" type="text" ref="cnpj" defaultValue={this.props.cnpj}/>
            </div>
          </div>
          <div className="form__row">
            <label>Razão Social:</label>
            <input name="Razão Social" type="text" ref="officialName" defaultValue={this.props.officialName}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Inscrição Estadual:</label>
              <input name="Inscrição Estadual" type="text" ref="registryES" defaultValue={this.props.registryES}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Inscrição Municipal:</label>
              <input name="Inscrição Municipal" type="text" ref="registryMU" defaultValue={this.props.registryMU}/>
            </div>
          </div>
        </div>
      )
    }
  }

  tabContentsContacts() {
    return this.state.contacts.map((contact) => {
      return(
        <div key={contact._id} ={contact._id} className="form--with-tabs hidden">
          {this.showDeleteRegistry()}
          <div className="form__row">
            <label>Nome Completo:</label>
            <input name="Nome do Contato" ref={"contactName_" + contact._id} type="text" defaultValue={contact.name}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>CPF:</label>
              <input name="CPF do Contato" ref={"contactCPF_" + contact._id} type="text" defaultValue={contact.cpf}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Email:</label>
              <input name="Email do Contato" ref={"contactEmail_" + contact._id} type="email" defaultValue={contact.email}/>
            </div>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Telefone 1:</label>
              <input name="Telefone 1 do Contato" ref={"contactPhone1_" + contact._id} type="text" defaultValue={contact.telephone_1}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Telefone 2:</label>
              <input ref={"contactPhone2_" + contact._id} type="text" defaultValue={contact.telephone_2}/>
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
          onRequestClose={this.closeEditWindow.bind(this)}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
          >
            {createNew ? <h2>Cadastrar Novo Cliente</h2> : <h2>Editar Cliente</h2>}
            <div>
              {this.renderError()}
            </div>
            <select defaultValue="company" ref="type" className="edit-clients__select-type" disabled={!this.props.createNew} onChange={this.changeTab.bind(this)}>
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
            <form onSubmit={this.props.createNew ? this.props.createNew : this.props.saveEdits}>
              {this.tabContentsCompany()}
              {this.tabContentsContacts()}
              {createNew ? null : <button type="button" className="button button--danger full-width" onClick={this.openConfirmationWindow.bind(this)}>Remover</button>}
              <div className="button__column1of2">
                <button type="button" className="button button--secondary" onClick={this.closeEditWindow.bind(this)}>Fechar</button>
              </div>
              <div className="button__column2of2">
                {createNew ? <button className="button button--primary">Criar</button> : <button className="button button--primary" onClick={this.openConfirmationWindow.bind(this)}>Salvar</button>}
              </div>
            </form>
            {this.state.confirmationWindow ? <ConfirmationMessage
              title={this.state.confirmationMessage}
              unmountMe={this.closeConfirmationWindow.bind(this)}
              confirmMe={this.closeWithRemoval.bind(this)}/> : null}
        </ReactModal>
      )
    }
  }

  render() {
    if(this.props.createNew) {
      return(
        <div>
          <button className="button--pill list-view__button" onClick={this.openEditWindow.bind(this)}>+</button>
          {this.editClientScreen(this.state.editOpen, '', '', '', true)}
        </div>
      )
    } else {
      return (
          <tr>
            <td className="list-view__left-align">{this.props._id}</td>
            <td className="list-view__left-align">{this.props.companyName}</td>
            <td className="list-view__right-align list-view__edit"><button className="button--pill list-view__button" onClick={this.openEditWindow.bind(this)}>Editar</button></td>
            {this.editClientScreen(this.state.editOpen, this.props._id, this.props.description, this.props.price)}
          </tr>
      )
    }
  }
}