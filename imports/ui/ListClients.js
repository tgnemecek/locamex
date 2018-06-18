import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import customTypes from '../startup/custom-types';
import PrivateHeader from './PrivateHeader';
import { Clients } from '../api/clients';

import CustomInput from './CustomInput';
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

      let contacts = [];
      let contactsNew = [];
      for (var i = 0; i < database.length; i++) {
        contacts = database[i].contacts;
        for (var j = 0; j < contacts.length; j++) {
          if (contacts[j].visible) {
            contactsNew.push(contacts[j]);
          }
        }
        database[i].contacts = contactsNew;
      }
      this.setState({ database });
    })
  }

  renderClients = (e) => {
    if (this.state.database.length > 0) {
      return this.state.database.map((client, index) => {
        return <ClientItem
          key={client._id}
          _id={client._id}
          companyName={client.companyName}
          officialName={client.officialName}
          cnpj={client.cnpj}
          registryES={client.registryES}
          registryMU={client.registryMU}
          formType={client.type}
          observations={client.observations}
          contacts={this.state.database[index].contacts}
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
      contactTabs: this.props.contacts ? this.props.contacts.length : '',

      //States used for controlled inputs
      companyName: this.props.companyName,
      cnpj: this.props.cnpj,
      officialName: this.props.officialName,
      registryES: this.props.registryES,
      registryMU: this.props.registryMU,
      contactInformation: [{
        _id: '',
        contactName: '',
        contactEmail: '',
        contactCPF: '',
        contactPhone1: '',
        contactPhone2: '',
        placeholder: true,
        visible: true
      }],
      observations: this.props.observations
    }
    this.state["formTab"] = this.state.formType == 'company' ? 0 : 1;

    if (this.props.contacts) {
      for (var i = 0; i < this.props.contacts.length; i++) {
        this.state["contactInformation"][i] = {
          _id: this.props.contacts[i]._id,
          contactName: this.props.contacts[i].contactName,
          contactEmail: this.props.contacts[i].contactEmail,
          contactCPF: this.props.contacts[i].contactCPF,
          contactPhone1: this.props.contacts[i].contactPhone1,
          contactPhone2: this.props.contacts[i].contactPhone2,
          placeholder: false,
          visible: true
        }
      }
    }
    this.initialState = JSON.parse(JSON.stringify(this.state));
  };

  handleSubmit = (e) => {
    return;
  }

  handleChange = (name, value, id) => {
    if (name.target) {
      this.setState({ [name.target.name]: name.target.value });
    } else {
      this.setState({ [name]: value });
    }
  }

  handleChangeContact = (name, value, id) => {
    let contactInformation = this.state.contactInformation;
    contactInformation[id][name] = value;
    this.setState({ contactInformation });
  }

  openEditWindow = (e) => {
    this.setState({editOpen: true});
  };

  closeEditWindow = (e) => {
    this.setState(JSON.parse(JSON.stringify(this.initialState)));
  };

  closeConfirmationWindow = (e) => {
    this.setState({ confirmationWindow: false });
  }

  removeSpecialCharacters = (e) => {
    let value = e.target.value;
    value = value.replace(/-./g, '');
  } //Arrumar

  renderError = () => {
    if (Array.isArray(this.state.formError)) {
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
    } else {
      return <h3 className="error-message">{this.state.formError}</h3>
    }
  }

  openConfirmationWindow = (e) => {
    e.preventDefault();

    var requiredFieldsProposal = [];
    var requiredFieldsContract = [];
    var formError = [];
    var errorCount = 0;
    var confirmationMessage = [];

    this.setState({ isError: false });

    if (this.state.formType == 'company') {
      requiredFieldsProposal = [
        {key: 'contactName', title: 'Nome do Contato', type: 'text'},
        {key: 'contactEmail', title: 'Email do Contato', type: 'email'},
        {key: 'contactPhone1', title: 'Telefone 1 do Contato', type: 'text'},
        {key: 'companyName', title: 'Nome da Empresa', type: 'text'}
      ];
      requiredFieldsContract = [
        //Company
        {key: 'companyName', title: 'Nome da Empresa', type: 'text'},
        {key: 'officialName', title: 'Razão Social', type: 'text'},
        {key: 'cnpj', title: 'CNPJ', type: 'cnpj'},
        {key: 'registryES', title: 'Inscrição Estadual', type: 'text'},
        // {key: 'registryMU', title: 'Inscrição Municipal', type: 'text'},
        //Contact
        {key: 'contactName', title: 'Nome do Contato', type: 'text'},
        {key: 'contactCPF', title: 'CPF do Contato', type: 'cpf'},
        {key: 'contactEmail', title: 'Email do Contato', type: 'email'},
        {key: 'contactPhone1', title: 'Telefone 1 do Contato', type: 'text'}
      ];
    } else {
      requiredFieldsProposal = [
        {key: 'contactName', title: 'Nome do Contato', type: 'text'},
        {key: 'contactEmail', title: 'Email do Contato', type: 'email'},
        {key: 'contactPhone1', title: 'Telefone 1 do Contato', type: 'text'}
      ];
      requiredFieldsContract = [
        {key: 'contactName', title: 'Nome do Contato', type: 'text'},
        {key: 'contactCPF', title: 'CPF do Contato', type: 'cpf'},
        {key: 'contactEmail', title: 'Email do Contato', type: 'email'},
        {key: 'contactPhone1', title: 'Telefone 1 do Contato', type: 'text'}
      ];
    }

    for (var i = 0; i < requiredFieldsProposal.length; i++) {
      var state = this.state[requiredFieldsProposal[i].key];
      if (state !== undefined) {
        state.trim();
      } else {
        state = this.state.contactInformation[0][requiredFieldsProposal[i].key];
        state.trim();
      }
      if (!state) {
        errorCount++;
        formError.push(requiredFieldsProposal[i].title);
        this.setState({ isError: true, formError });
      } else {
        if (requiredFieldsProposal[i].type == 'cpf') {
          if (!customTypes.checkCPF(state)) {
            errorCount++;
            formError.push(requiredFieldsProposal[i].title + " Inválido");
            this.setState({ isError: true, formError });
          }
        }
        if (requiredFieldsProposal[i].type == 'cnpj') {
          if (!customTypes.checkCNPJ(state)) {
            errorCount++;
            formError.push(requiredFieldsProposal[i].title + " Inválido");
            this.setState({ isError: true, formError });
          }
        }
        if (requiredFieldsProposal[i].type == 'email') {
          if (!customTypes.checkEmail(state)) {
            errorCount++;
            formError.push(requiredFieldsProposal[i].title + " Inválido");
            this.setState({ isError: true, formError });
          }
        }
      }
    }

    if (errorCount) {return}

    for (var i = 0; i < requiredFieldsContract.length; i++) {
      var state = this.state[requiredFieldsContract[i].key];
      if (state !== undefined) {
        state.trim();
      } else {
        state = this.state.contactInformation[0][requiredFieldsContract[i].key];
        state.trim();
      }

      if (!state) {
        confirmationMessage.push({
          key: i + 3,
          text: "-" + requiredFieldsContract[i].title,
        });
      }
    }

    if (confirmationMessage.length == 0) {
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

  saveEdits = (e) => {
    let state = this.state;
    let cleanContacts = [];

    state.contactInformation.forEach((contact) => {
      delete contact["placeholder"];
      if (contact.contactName) {
        cleanContacts.push(contact);
      }
    })
    state.contactInformation = cleanContacts;

    Meteor.call('clients.update', this.props._id, state);
    this.closeEditWindow();
    window.location.reload();
  }

  createNewClient = (e) => {
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

  showCompanyTab = (e) => {
    if (this.state.formType == 'company') {
      return <button value={-1} onClick={this.changeTab} className="active">Empresa</button>
    }
  }

  showAddNewTab = (e) => {
    if (this.state.contactTabs < 4) {
      return <button className="tablinks placeholder" onClick={this.addNewTab}>Novo Contato</button>
    }
  }

  addNewTab = (e) => {

    let contactInformation = this.state.contactInformation;
    let lastTab = contactInformation.length;
    let contactTabs = this.state.contactTabs;

    contactInformation[lastTab] = {
      _id: '',
      contactName: '',
      contactEmail: '',
      contactCPF: '',
      contactPhone1: '',
      contactPhone2: '',
      placeholder: true,
      visible: true
    }
    contactTabs++;
    this.setState({ contactInformation, contactTabs });
  }

  changeTab = (e) => {
    this.setState({ formTab: e.target.value });
    $("div.form__tab").find("button").removeClass("active");
    e.target.classList.add("active");

    var formArray = $("div.form--with-tabs").toArray();
    for (var i = 0; i < formArray.length; i++) {
      formArray[i].classList.add("hidden");
    }
    if (e.target.value !== "999") { //Observações
      document.getElementsByClassName('form--with-tabs')[(Number(e.target.value) + 1)].classList.remove("hidden");
    } else {
      document.getElementById('observations-form').classList.remove("hidden");
    }

  }

  showDeleteRegistry = (e) => {
    if (this.state.contactInformation[this.state.formTab] !== undefined) {
      if (this.state.formTab >= 0 && !this.state.contactInformation[this.state.formTab].placeholder) {
        return <button className="button--delete-registry"
          value={this.state.contactInformation[this.state.formTab]._id}
          onClick={this.removeContact}>Excluir Contato</button>
      }
    }
  }

  removeContact = (e) => {
    e.preventDefault();
    if (this.props.contacts.length == 1) {
      this.setState({ formError: "O cliente deve ter pelo menos um contato." });
      return;
    }
    Meteor.call('clients.hideContact', this.props._id, e.target.value);
    this.closeEditWindow();
    window.location.reload();
  }

  showTabs = (e) => {
    return this.state.contactInformation.map((contact, index) => {
        return <button key={index} value={index} onClick={this.changeTab}>Contato {index+1}</button>
      })
  }

  tabContentsCompany = (e) => {
    if (this.state.formType == 'company') {
      return(
        <div id="company-form" className="form--with-tabs" onSubmit={this.props.createNew ? this.props.createNew : this.props.saveEdits}>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Nome Fantasia:</label>
              <CustomInput title="Nome Fantasia" name="companyName"
                type="text"
                defaultValue={this.state.companyName}
                onChange={this.handleChange}/>
            </div>
            <div className="form__half-column-2of2">
              <label>CNPJ:</label>
              <CustomInput title="CNPJ" name="cnpj"
                type="cnpj"
                defaultValue={this.state.cnpj}
                onChange={this.handleChange}
                />
            </div>
          </div>
          <div className="form__row">
            <label>Razão Social:</label>
            <CustomInput title="Razão Social" name="officialName"
              type="text"
              defaultValue={this.state.officialName}
              onChange={this.handleChange}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Inscrição Estadual:</label>
              <CustomInput title="Inscrição Estadual" name="registryES"
                type="text"
                defaultValue={this.state.registryES}
                onChange={this.handleChange}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Inscrição Municipal:</label>
              <CustomInput title="Inscrição Municipal" name="registryMU"
                type="text"
                defaultValue={this.state.registryMU}
                onChange={this.handleChange}/>
            </div>
          </div>
        </div>
      )
    }
  }

  tabContentsContacts = (e) => {
    return this.state.contactInformation.map((contact, index) => {
      return(
        <div key={index} className="form--with-tabs hidden">
          {this.showDeleteRegistry()}
          <div className="form__row">
            <label>Nome Completo:</label>
            <CustomInput title="Nome do Contato" name="contactName" id={index}
              type="text"
              defaultValue={this.state.contactInformation[index].contactName}
              onChange={this.handleChangeContact}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>CPF:</label>
              <CustomInput title="CPF do Contato" name="contactCPF" id={index}
                type="cpf"
                defaultValue={this.state.contactInformation[index].contactCPF}
                onChange={this.handleChangeContact}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Email:</label>
              <CustomInput title="Email do Contato" name="contactEmail" id={index}
                type="email"
                defaultValue={this.state.contactInformation[index].contactEmail}
                onChange={this.handleChangeContact}/>
            </div>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Telefone 1:</label>
              <CustomInput title="Telefone 1 do Contato" name="contactPhone1" id={index}
                type="phone"
                defaultValue={this.state.contactInformation[index].contactPhone1}
                onChange={this.handleChangeContact}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Telefone 2:</label>
              <CustomInput title="Telefone 2 do Contato" name="contactPhone2" id={index}
                type="text"
                value={this.state.contactInformation[index].contactPhone2}
                onChange={this.handleChangeContact}/>
            </div>
          </div>
        </div>
      )
    })
  }

  tabContentObservations = (e) => {
    return (
      <div id="observations-form" className="form--with-tabs hidden" onSubmit={this.props.createNew ? this.props.createNew : this.props.saveEdits}>
        <div className="form__row">
          <label>Observações:</label>
          <textarea title="Observações" name="observations" onChange={this.handleChange} value={this.state.observations}></textarea>
        </div>
      </div>
    )
  }

  editClientScreen = (open, _id, description, price, createNew) => {
    if (open) {
      return(
        <ReactModal
          isOpen={true}
          className="boxed-view"
          contentLabel="Editar Serviço"
          appElement={document.body}
          onRequestClose={this.closeEditWindow}
          className="boxed-view__box"
          overlayClassName="boxed-view boxed-view--modal"
          >
            {createNew ? <h2>Cadastrar Novo Cliente</h2> : <h2>Editar Cliente</h2>}
            <div>
              {this.renderError()}
            </div>
            <select defaultValue="company" ref="type" className="edit-clients__select-type" disabled={!this.props.createNew} onChange={this.changeTab}>
              <option value="company">Pessoa Jurídica</option>
              <option value="person">Pessoa Física</option>
            </select>
            <div className="form__tab">
              {this.showCompanyTab()}
              {this.showTabs()}
              {this.showAddNewTab()}
              <button value={999} onClick={this.changeTab}>Observações</button>
            </div>
            <form onSubmit={this.props.createNew ? this.props.createNew : this.props.saveEdits}>
              {this.tabContentsCompany()}
              {this.tabContentsContacts()}
              {this.tabContentObservations()}
              <div className="button__column1of2">
                <button type="button" className="button button--secondary" onClick={this.closeEditWindow}>Fechar</button>
              </div>
              <div className="button__column2of2">
                {createNew ? <button className="button button--primary">Criar</button> : <button className="button button--primary" onClick={this.openConfirmationWindow}>Salvar</button>}
              </div>
            </form>
            {this.state.confirmationWindow ? <ConfirmationMessage
              title={this.state.confirmationMessage}
              unmountMe={this.closeConfirmationWindow}
              confirmMe={this.saveEdits}/> : null}
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
            <td className="list-view__left-align">{this.props.companyName}</td>
            <td className="list-view__right-align list-view__edit"><button className="button--pill list-view__button" onClick={this.openEditWindow}>Editar</button></td>
            {this.editClientScreen(this.state.editOpen, this.props._id, this.props.description, this.props.price)}
          </tr>
      )
    }
  }
}