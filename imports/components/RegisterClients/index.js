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

export default class RegisterClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      officialName: this.props.item.officialName || '',
      type: this.props.item.type || '',
      registry: this.props.item.registry || '',
      registryES: this.props.item.registryES || '',
      registryMU: this.props.item.registryMU || '',
      address: this.props.item.address || {
        number: '',
        street: '',
        city: '',
        state: '',
        cep: ''
      },
      observations: this.props.item.observations || '',
      contacts: this.props.item.contacts || [],

      confirmationWindow: false,
      tab: 'main'
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
    var contacts = [];
    for (var i = 0; i < this.state.contacts.length; i++) {
      if (this.state.contacts[i].name) contacts.push(this.state.contacts[i]);
    }
    contacts.forEach((contact, i) => {
      contact._id = i.toString().padStart(4, '0');
    })
    var state = {...this.state, contacts};
    if (this.props.item._id) {
      Meteor.call('clients.update', state);
    } else Meteor.call('clients.insert', state);
    this.props.toggleWindow();
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
      return {value: (i+2), title: `Contato ${i + 1}`}
    })
    var arr3 = [
      {value: 'observations', title: 'OBS'},
      {value: '+', title: '+'}
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
            {this.state.tab > 1 ?
              <button className="button button--danger" style={{width: "100%"}} onClick={this.toggleConfirmationWindow}>Excluir Contato</button>
            : null}
            <FooterButtons buttons={[
              {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
              {text: "Salvar", onClick: () => this.saveEdits()}
            ]}/>
        </Box>
      </ErrorBoundary>
    )
  }
}