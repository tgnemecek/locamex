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

  renderClients = (e) => {
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
          observations={client.observations}
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
                {/* <td className="list-view__right-align list-view__small"><ClientItem key={0} createNew={true}/></td> */}
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
      contactTabs: this.props.contacts.length,

      //States used for controlled inputs
      companyName: this.props.companyName,
      cnpj: this.props.cnpj,
      officialName: this.props.officialName,
      registryES: this.props.registryES,
      registryMU: this.props.registryMU,
      contactInformation: [{
        contactName: this.props.contactName,
        contactEmail: this.props.contactEmail,
        contactCPF: this.props.contactCPF,
        contactPhone1: this.props.contactPhone1,
        contactPhone2: this.props.contactPhone2
      }]
    }

    this.state["formTab"] = this.state.formType == 'company' ? 0 : 1;
    this.initialState = this.state;
  };

  handleSubmit = (e) => {
    return;
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  openEditWindow = (e) => {
    this.setState({editOpen: true});
  };

  closeEditWindow = (e) => {
    this.setState(this.initialState);
  };

  closeConfirmationWindow = (e) => {
    this.setState({ confirmationWindow: false });
  }

  removeSpecialCharacters = (e) => {
    let value = e.target.value;
    value = value.replace(/-./g, '');
  } //Arrumar

  renderError = (e) => {
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
  } //Testar


  openConfirmationWindow = (e) => { //AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
    e.preventDefault();

    var requiredFieldsProposal = [];
    var requiredFieldsContract = [];
    var formError = [];
    var confirmationMessage = [];

    this.setState({ isError: false });

    if (this.state.formType == 'company') {
      requiredFieldsProposal = [
        'companyName',
        'contactName',
        'contactEmail',
        'contactPhone1'
      ];
      requiredFieldsContract = [
        //Company
        'companyName',
        'officialName',
        'cnpj',
        'registryES',
        'registryMU',
        //Contact
        'contactName',
        'contactCPF',
        'contactEmail',
        'contactPhone1'
      ];
    } else {
      requiredFieldsProposal = [
        'contactName',
        'contactEmail',
        'contactPhone1'
      ];
      requiredFieldsContract = [
        'contactName',
        'contactCPF',
        'contactEmail',
        'contactPhone1'
      ];
    }

    for (var i = 0; i < requiredFieldsProposal.length; i++) {
      var state = this.state[requiredFieldsProposal[i]];
      console.log(requiredFieldsProposal[i]);
      state.trim();

      if (!state) {
        formError.push(state.title);
        this.setState({ isError: true, formError });
        return;
      }
    }

    for (var i = 0; i < requiredFieldsContract.length; i++) {
      var state = this.state[requiredFieldsContract[i]];
      state.trim();

      if (!state) {
        confirmationMessage.push({
          key: i + 3,
          text: "-" + state.title,
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
    // Meteor.call('clients.update', this.props._id, description, price);
    // this.setState({ price });
    this.closeEditWindow();
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
      return <button value={0} onClick={this.changeTab} className="active">Empresa</button>
    }
  }

  showAddNewTab = (e) => {
    if (this.state.contactTabs < 4) {
      return <button className="tablinks placeholder" onClick={this.newContactTab}>Novo Contato</button>
    }
  }

  newContactTab = (e) => {
    this.setState({ contactTabs: this.state.contactTabs + 1 });
  }

  changeTab = (e) => {
    this.setState({ formTab: e.target.value });
    $("div.form__tab").find("button").removeClass("active");
    e.target.classList.add("active");

    var formArray = $("div.form--with-tabs").toArray();
    for (var i = 0; i < formArray.length; i++) {
      formArray[i].classList.add("hidden");
    }
    document.getElementsByClassName('form--with-tabs')[e.target.value].classList.remove("hidden");
  }

  showDeleteRegistry = (e) => {
    if (this.state.formTab > 0) {
      return <button className="button--delete-registry">Excluir Registro</button>
    }
  }

  showTabs = (e) => {
    var totalTabs = [];
    for (var i = 0; i < this.props.contacts.length; i++) {
      totalTabs[i] = this.props.contacts[i];
    }
    for (var i = totalTabs.length; i < this.state.contactTabs; i++) {
      totalTabs[i] = {
        _id: i,
        name: '',
        telephone_1: '',
        telephone_2: '',
        email: '',
        cpf: ''
      };
    }
    return totalTabs.map((contact) => {
        return <button key={contact._id} value={contact._id+1} onChange={this.changeTab}>Contato {(contact._id + 1)}</button>
      })
  }

  changeRequiredFields = (e) => {
    if (this.state.formType == 'company') {
      $("div.form--with-tabs")[0].find("input").prop('required, true');////////////MELHORAR ESSA FUNCAO!
    } else {
      $("#company-form").find("input").prop('required, false');
    }
  }

  tabContentsCompany = (e) => {
    if (this.state.formType == 'company') {
      return(
        <div id="company-form" className="form--with-tabs" onSubmit={this.props.createNew ? this.props.createNew : this.props.saveEdits}>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Nome Fantasia:</label>
              <input title="Nome Fantasia" type="text" name="companyName" onChange={this.handleChange} value={this.state.companyName}/>
            </div>
            <div className="form__half-column-2of2">
              <label>CNPJ:</label>
              <input title="CNPJ" type="text" name="cnpj" onChange={this.handleChange} value={this.state.cnpj}/>
            </div>
          </div>
          <div className="form__row">
            <label>Razão Social:</label>
            <input title="Razão Social" type="text" name="officialName" onChange={this.handleChange} value={this.state.officialName}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Inscrição Estadual:</label>
              <input title="Inscrição Estadual" type="text" name="registryES" onChange={this.handleChange} value={this.state.registryES}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Inscrição Municipal:</label>
              <input title="Inscrição Municipal" type="text" name="registryMU" onChange={this.handleChange} value={this.state.registryMU}/>
            </div>
          </div>
        </div>
      )
    }
  }

  tabContentsContacts = (e) => {
    return this.props.contacts.map((contact) => {
      return(
        <div key={contact._id} className="form--with-tabs hidden">
          {this.showDeleteRegistry()}
          <div className="form__row">
            <label>Nome Completo:</label>
            <input title="Nome do Contato" name="contactName" type="text" onChange={this.handleChange} value={this.state.contactName}/>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>CPF:</label>
              <input title="CPF do Contato" name="contactCPF" type="text" onChange={this.handleChange} value={this.state.contactCPF}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Email:</label>
              <input title="Email do Contato" name="contactEmail" type="email" onChange={this.handleChange} value={this.state.contactEmail}/>
            </div>
          </div>
          <div className="form__row">
            <div className="form__half-column-1of2">
              <label>Telefone 1:</label>
              <input title="Telefone 1 do Contato" name="contactPhone1" type="text" onChange={this.handleChange} value={this.state.contactPhone1}/>
            </div>
            <div className="form__half-column-2of2">
              <label>Telefone 2:</label>
              <input ref="contactPhone2" type="text" name="contactPhone2" onChange={this.handleChange} value={this.state.contactPhone2}/>
            </div>
          </div>
        </div>
      )
    })
  }

  renderForms = (e) => {

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
            </div>
            <form onSubmit={this.props.createNew ? this.props.createNew : this.props.saveEdits}>
              {this.renderForms()}
              {this.tabContentsCompany()}
              {this.tabContentsContacts()}
              {createNew ? null : <button type="button" className="button button--danger full-width" onClick={this.openConfirmationWindow}>Remover</button>}
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
            <td className="list-view__left-align">{this.props.companyName}</td>
            <td className="list-view__right-align list-view__edit"><button className="button--pill list-view__button" onClick={this.openEditWindow}>Editar</button></td>
            {this.editClientScreen(this.state.editOpen, this.props._id, this.props.description, this.props.price)}
          </tr>
      )
    }
  }
}