import ReactModal from 'react-modal';
import React from 'react';
import update from 'immutability-helper';
import { Meteor } from 'meteor/meteor';

import customTypes from '../startup/custom-types';

import CustomInput from './CustomInput';
import ConfirmationMessage from './ConfirmationMessage';

export default class EditClient extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmationWindow: false,
      confirmationMessage: '',
      formError: '',
      isError: false,

      requiredFieldsProposal: [],
      requiredFieldsContract: [],

      formType: this.props.formType ? this.props.formType : "company",
      formTab: this.props.formType ? 1 : 0,

      //States used for controlled inputs
      clientName: this.props.clientName ? this.props.clientName : '',
      cnpj: this.props.cnpj ? this.props.cnpj : '',
      officialName: this.props.officialName ? this.props.officialName : '',
      registryES: this.props.registryES ? this.props.registryES : '',
      registryMU: this.props.registryMU ? this.props.registryMU : '',
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
      observations: this.props.observations ? this.props.observations : ''
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
  };

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
//------------- Close/Open Window:
  confirmationWindow = () => {
    let closeWindow = () => this.setState({ confirmationWindow: false });
    if (this.state.confirmationWindow) {
      return <ConfirmationMessage
        title={this.state.confirmationMessage}
        unmountMe={closeWindow}
        confirmMe={this.saveEdits}/>
    } else return null
  }

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

  checkFields = (e) => {
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
        {key: 'clientName', title: 'Nome da Empresa', type: 'text'}
      ];
      requiredFieldsContract = [
        //Company
        {key: 'clientName', title: 'Nome da Empresa', type: 'text'},
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
        if (state !== undefined) {state.trim()}
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
      text: 'O formulário contém campos inválidos obrigatórios para a emissão de contrato. Deseja continuar mesmo assim?'
    });
    confirmationMessage.unshift({
      key: 0,
      text: 'Atenção:'
    });

    this.setState({ confirmationMessage });
    this.setState({ confirmationWindow: true });
  }

  saveEdits = (e) => {
    var contactInformation = this.state.contactInformation;
    var emptyIndexes = [];

    this.state.contactInformation.forEach((contact, index, array) => {
      delete contact["placeholder"];
      if (!contact.contactName) {
        contactInformation.splice(index, 1);
      }
    });

    this.setState({contactInformation});

    if (this.props.createNew) {
      Meteor.call('clients.insert', this.state);
    } else { Meteor.call('clients.update', this.props._id, this.state) };

    this.props.closeEditWindow();
  }
//------------- Tabs:
  showCompanyTab = (e) => {
    let className = 'hidden';
    if (this.state.formType == 'company') {
      className = this.state.formTab == 0 ? 'active' : '';
    }
    return <button value={0} onClick={this.changeTab} id="companyTab"
              className={className}>Empresa</button>
  }

  showContactTabs = (e) => {
    return this.state.contactInformation.map((contact, index) => {
      let trueIndex = index + 1;
      return <button key={trueIndex} value={trueIndex} onClick={this.changeTab}
                className={this.state.formTab == trueIndex ? 'active' : ''}>Contato {trueIndex}</button>
    })
  }

  showAddNewTab = (e) => {
    if (this.state.contactInformation.length < 10) {
      return <button className="tablinks placeholder" onClick={this.addNewTab}>Novo Contato</button>
    }
  }

  addNewTab = (e) => {

    let contactInformation = this.state.contactInformation;
    let lastTab = contactInformation.length;
    let contactTabs = this.state.contactInformation.length;

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
    this.setState({ contactInformation, formTab: lastTab+1 });
  }

  changeTab = (e) => {
    this.setState({ formTab: e.target.value });
  }

  changeFormType = (e) => {
    this.setState({ formType: e.target.value, formTab: e.target.value == 'company' ? 0 : 1 });
  }
//------------- Contents:
  tabContentsCompany = (e) => {
    var className = "form--with-tabs hidden";
    if (this.state.formType == 'company' && this.state.formTab == 0) {
      className = "form--with-tabs";
    }

    return(
      <div id="company-form" className={className}>
        <div className="form__row">
          <div className="form__half-column-1of2">
            <label>Nome Fantasia:</label>
            <CustomInput title="Nome Fantasia" name="clientName"
              type="text"
              value={this.state.clientName}
              onChange={this.handleChange}/>
          </div>
          <div className="form__half-column-2of2">
            <label>CNPJ:</label>
            <CustomInput title="CNPJ" name="cnpj"
              type="cnpj"
              value={this.state.cnpj}
              disabled={true}
              onChange={this.handleChange}
              />
          </div>
        </div>
        <div className="form__row">
          <label>Razão Social:</label>
          <CustomInput title="Razão Social" name="officialName"
            type="text"
            value={this.state.officialName}
            upperCase={true}
            onChange={this.handleChange}/>
        </div>
        <div className="form__row">
          <div className="form__half-column-1of2">
            <label>Inscrição Estadual:</label>
            <CustomInput title="Inscrição Estadual" name="registryES"
              type="text"
              value={this.state.registryES}
              onChange={this.handleChange}/>
          </div>
          <div className="form__half-column-2of2">
            <label>Inscrição Municipal:</label>
            <CustomInput title="Inscrição Municipal" name="registryMU"
              type="text"
              value={this.state.registryMU}
              onChange={this.handleChange}/>
          </div>
        </div>
      </div>
    )
  }

  tabContentsContacts = (e) => {
    return this.state.contactInformation.map((contact, index) => {
      let trueIndex = index + 1;
      let className = this.state.formTab == trueIndex ? "form--with-tabs" : "form--with-tabs hidden";

      return(
        <div key={index} className={className}>
          {index !== 0 ? this.showDeleteRegistry() : null}
          <div className="form__row">
            <label>Nome Completo:</label>
            <CustomInput title="Nome do Contato" name="contactName" id={index}
              type="text"
              value={this.state.contactInformation[index].contactName}
              onChange={this.handleChangeContact}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>CPF:</label>
              <CustomInput title="CPF do Contato" name="contactCPF" id={index}
                type="cpf"
                disabled={index == 0 ? true : false}
                value={this.state.contactInformation[index].contactCPF}
                onChange={this.handleChangeContact}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Email:</label>
              <CustomInput title="Email do Contato" name="contactEmail" id={index}
                type="email"
                value={this.state.contactInformation[index].contactEmail}
                onChange={this.handleChangeContact}/>
            </div>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Telefone 1:</label>
              <CustomInput title="Telefone 1 do Contato" name="contactPhone1" id={index}
                type="phone"
                value={this.state.contactInformation[index].contactPhone1}
                onChange={this.handleChangeContact}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Telefone 2:</label>
              <CustomInput title="Telefone 2 do Contato" name="contactPhone2" id={index}
                type="phone"
                value={this.state.contactInformation[index].contactPhone2}
                onChange={this.handleChangeContact}/>
            </div>
          </div>
        </div>
      )
    })
  }

  tabContentObservations = (e) => {
    var className = "form--with-tabs hidden";
    if (this.state.formTab == 999) {
      className = "form--with-tabs";
    }
    return (
      <div id="observations-form" className={className} onSubmit={this.props.createNew ? this.props.saveEdits : this.props.saveEdits}>
        <div className="form__row">
          <label>Observações:</label>
          <textarea title="Observações" name="observations" onChange={this.handleChange} value={this.state.observations}></textarea>
        </div>
      </div>
    )
  }

  showDeleteRegistry = (e) => {

    var removeContact = (e) => {
      e.preventDefault();
      var index = (Number(e.target.value) -1);

      this.setState((prevState) => {
        let contactInformation = prevState.contactInformation;
        contactInformation.splice(index, 1);
        return {
          contactInformation: contactInformation,
          formTab: (prevState.formTab - 1)
        }
      });
    }

    return (
      <button className="button--delete-registry"
        value={this.state.formTab}
        onClick={removeContact}>Excluir Contato
      </button>
    )
  }

  render () {
    return (
      <ReactModal
        isOpen={true}
        className="boxed-view"
        contentLabel="Editar Serviço"
        appElement={document.body}
        onRequestClose={this.props.closeEditWindow}
        className="boxed-view__box"
        overlayClassName="boxed-view boxed-view--modal"
        >
          <div>
            {this.props.createNew ? <h2>Cadastrar Novo Cliente</h2> : <h2>Editar Cliente</h2>}
            <div>
              {this.renderError()}
            </div>
            <select defaultValue={this.state.formType} ref="type" className="edit-clients__select-type" disabled={!this.props.createNew} onChange={this.changeFormType}>
              <option value="company">Pessoa Jurídica</option>
              <option value="person">Pessoa Física</option>
            </select>
            <div className="form__tab">
              {this.showCompanyTab()}
              {this.showContactTabs()}
              {this.showAddNewTab()}
              <button value={999} onClick={this.changeTab}>Observações</button>
            </div>
            <form>
              {this.tabContentsCompany()}
              {this.tabContentsContacts()}
              {this.tabContentObservations()}
              <div className="button__column1of2">
                <button type="button" className="button button--secondary" onClick={this.props.closeEditWindow}>Fechar</button>
              </div>
              <div className="button__column2of2">
                <button className="button button--primary" onClick={this.checkFields}>{this.props.createNew ? "Criar" : "Salvar"}</button>
              </div>
            </form>
            {this.confirmationWindow()}
          </div>
      </ReactModal>
    )
  }
}