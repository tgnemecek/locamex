import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import Tab from '/imports/components/Tab/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import FooterButtons from '/imports/components/FooterButtons/index';

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
        state: 'SP',
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
      errorKeys: [],
      databaseStatus: ''
    }
  }
  onChange = (e) => {
    var key = e.target.name;
    var value = e.target.value;
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);

    this.setState({ [key]: value, errorKeys });
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
    var contacts = [...this.state.contacts];

    var check = checkRequiredFields({
      ...this.state,
      contacts: []
    });

    if (check !== true) {
      this.setState({
        errorMsg: 'Campos obrigatórios não preenchidos/inválidos.',
        errorKeys: check
      })
    } else {
      var contacts = contacts.filter((contact, i) => {
        contact._id = tools.generateId();
        return !!contact.name;
      })

      var state = {
        ...this.state,
        contacts
      }

      this.setState({ databaseStatus: "loading" }, () => {
        if (this.props.item._id) {
          Meteor.call('clients.update', state, (err, res) => {
            if (res) {
              this.setState({
                databaseStatus: {
                  status: "completed",
                  callback: () => this.props.toggleWindow()
                }
              });
            }
            if (err) {
              console.log(err);
              this.setState({
                databaseStatus: "failed"
              });
            }
          });
        } else Meteor.call('clients.insert', state, (err, res) => {
          if (res) {
            this.setState({
              databaseStatus: {
                status: "completed",
                callback: () => this.props.toggleWindow(res)
              }
            });
          }
          if (err) {
            if (err.error === 'duplicate-registry') {
              this.setState({
                errorMsg: 'CPF/CNPJ duplicado! O Cliente que você está tentando cadastrar possivelmente já existe no banco de dados.',
                databaseStatus: "failed"
              })
            } else {
              console.log(err);
              this.setState({
                databaseStatus: "failed"
              });
            }
          }
        });
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
    var contacts = [...this.state.contacts];
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
        <Box className="register-data"
          title={this.props.item._id ? "Editar Cliente" : "Criar Novo Cliente"}
          closeBox={this.props.toggleWindow}
          width="800px">
          <Input
            type="select"
            name="type"
            className="register-clients__type-select"
            disabled={!!this.props.item._id}
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
          <ConfirmationWindow
            isOpen={this.state.confirmationWindow}
            closeBox={this.toggleConfirmationWindow}
            message="Deseja mesmo excluir este item do banco de dados?"
            leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
            rightButton={{text: "Sim", className: "button--danger", onClick: this.removeItem}}/>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
          <DatabaseStatus
            status={this.state.databaseStatus}
          />
        </Box>
      </ErrorBoundary>
    )
  }
}