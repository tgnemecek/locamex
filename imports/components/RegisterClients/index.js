import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Tab from '/imports/components/Tab/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

import MainTab from './MainTab/index';
import AddressTab from './AddressTab/index';
import ContactTab from './ContactTab/index';

export default class RegisterClients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || '',
      confirmationWindow: false,
      tab: 0
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
    if (this.props.item._id) {
      Meteor.call('services.update', this.state._id, this.state.description, this.state.price);
    } else Meteor.call('services.insert', this.state.description, this.state.price);
    this.props.toggleWindow();
  }
  changeTab = () => {

  }
  render() {
    var CurrentTab;
    if (this.state.tab === 0) CurrentTab = MainTab;
    if (this.state.tab === 1) CurrentTab = AddressTab;
    if (this.state.tab > 1) CurrentTab = ContactTab;
    return (
      <Box
        title={this.props.item._id ? "Editar Registro" : "Criar Novo Registro"}
        closeBox={this.props.toggleWindow}
        width="800px">
        <Tab
          onClick={this.changeTab}>
          <span>Principal</span>
          <span>Contato 1</span>
        </Tab>
        <CurrentTab onChange={this.onChange} itemState={this.state}/>
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
          {this.props.item._id ?
            <button className="button button--danger" style={{width: "100%"}} onClick={this.toggleConfirmationWindow}>Excluir Registro</button>
          : null}
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
            {text: "Salvar", onClick: () => this.saveEdits()}
          ]}/>
      </Box>
    )
  }
}