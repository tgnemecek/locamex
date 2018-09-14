import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Tab from '/imports/components/Tab/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

import MainTab from './MainTab/index';
import AddressTab from './AddressTab/index';
import ContactTab from './ContactTab/index';
import ObservationsTab from './ObservationsTab/index';
import checkRequiredFields from './check-required-fields/index';

export default class RegisterClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      officialName: this.props.item.officialName || '',
      type: this.props.item.type || 'company',
      registry: this.props.item.registry || '',
      registryES: this.props.item.registryES || '',
      registryMU: this.props.item.registryMU || '',
      rg: this.props.item.rg || '',
      phone1: this.props.item.phone1 || '',
      phone2: this.props.item.phone2 || '',
      email: this.props.item.email || '',
      address: this.props.item.address || {
        number: '',
        street: '',
        city: '',
        state: '',
        cep: '',
        additional: ''
      },
      observations: this.props.item.observations || '',
      contacts: this.props.item.contacts || [{
        _id: '',
        name: '',
        phone1: '',
        phone2: '',
        email: '',
        cpf: '',
        rg: '',
        visible: true
      }],

      confirmationWindow: false,
      tab: 'main',
      errorMsg: '',
      errorKeys: []
    }
  }
  onChange = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    this.setState({ [key]: value });
  }
  toggleConfirmationWindow = () => {
    var confirmationWindow = !this.state.confirmationWindow;
    this.setState({ confirmationWindow });
  }
  removeItem = () => {
    Meteor.call('services.hide', this.state._id);
    this.props.toggleWindow();
  }
  saveEdits = () => {
    var state = { ...this.state };
    var originalContacts = state.contacts;
    var contactsToCheck = [];
    if (state.type == "company") {
      contactsToCheck.push(state.contacts[0]);
      state.contacts = contactsToCheck;
    }
    var check = checkRequiredFields(state);
    state.contacts = originalContacts;

    if (check === true) {
      state.contacts.forEach((contact, i) => {
        if (state.type == 'person') i++;
        contact._id = i.toString().padStart(4, '0');
      })
      if (this.props.item._id) {
        Meteor.call('clients.update', state);
      } else Meteor.call('clients.insert', state);
      this.props.toggleWindow();
    } else {
      this.setState({
        errorMsg: 'Campos obrigatórios não preenchidos/inválidos.',
        errorKeys: check
      })
    }
  }
  changeTab = (tab) => {
    if (tab === '+') {
      this.addNewTab();
      tab = this.state.contacts.length + 2;
    }
    this.setState({ tab });
  }
  renderTabs = () => {
    var arr1 = [
      {value: 'main', title: 'Principal'},
      {value: 'address', title: 'Endereço'}
    ];
    var arr2 = this.state.contacts.map((contact, i) => {
      if (this.state.type == 'company') {
        return {value: (i+2), title: `Contato ${i + 1}`}
      } else return {value: (i+2), title: `Contato Adicional ${i + 1}`}
    })
    var arr3 = [
      {value: '+', title: '+'},
      {value: 'observations', title: 'OBS'}
    ];
    return arr1.concat(arr2, arr3);
  }
  addNewTab = () => {
    var contacts = tools.deepCopy(this.state.contacts);
    contacts.push({
      _id: '',
      name: '',
      phone1: '',
      phone2: '',
      email: '',
      cpf: '',
      rg: '',
      visible: true
    });
    this.setState({ contacts });
  }
  render() {
    return (
      <ErrorBoundary>
        <Box
          title={this.props.item._id ? "Editar Cliente" : "Criar Novo Cliente"}
          closeBox={this.props.toggleWindow}
          width="800px">
          <Input
            type="select"
            name="type"
            className="register-clients__type-select"
            readOnly={!!this.props.item.type}
            value={this.state.type}
            onChange={this.onChange}>
              <option value="company">Pessoa Jurídica</option>
              <option value="person">Pessoa Física</option>
          </Input>
          <div className="error-message">{this.state.errorMsg}</div>
          <Tab
            tab={this.state.tab}
            addNewTab={this.addNewTab}
            changeTab={this.changeTab}
            tabArray={this.renderTabs()}
          />
          {this.state.tab === 'main' ? <MainTab onChange={this.onChange} item={this.state}/> : null}
          {this.state.tab === 'address' ? <AddressTab onChange={this.onChange} item={this.state}/> : null}
          {Number(this.state.tab) > 1 ?
            <ContactTab key={this.state.tab} onChange={this.onChange} item={this.state}/>
          : null}
          {this.state.tab === 'observations' ? <ObservationsTab onChange={this.onChange} item={this.state}/> : null}
            {this.state.confirmationWindow ?
              <Box
                title="Aviso:"
                closeBox={this.toggleConfirmationWindow}>
                <p>Deseja mesmo excluir este item do banco de dados?</p>
                <FooterButtons buttons={[
                  {text: "Não", className: "button--secondary", onClick: () => this.toggleConfirmationWindow()},
                  {text: "Sim", className: "button--danger", onClick: () => this.removeItem()}
                ]}/>
              </Box>
            : null}
            {/* {this.state.tab > 1 ?
              <button className="button button--danger" style={{width: "100%"}} onClick={this.toggleConfirmationWindow}>Excluir Contato</button>
            : null} */}
            <FooterButtons buttons={[
              {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
              {text: "Salvar", onClick: () => this.saveEdits()}
            ]}/>
        </Box>
      </ErrorBoundary>
    )
  }
}