import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class RegisterServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || 0,

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false
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
    var errorKeys = [];
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else {
      if (this.props.item._id) {
        Meteor.call('services.update', this.state._id, this.state.description, this.state.price);
      } else Meteor.call('services.insert', this.state.description, this.state.price);
      this.props.toggleWindow();
    }
  }
  render() {
    return (
      <Box
        title={this.props.item._id ? "Editar Serviço" : "Criar Novo Serviço"}
        closeBox={this.props.toggleWindow}
        width="800px">
          <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={3} options={[{block: 0, span: 2}]}>
            <Input
              title="Descrição:"
              type="text"
              name="description"
              error={this.state.errorKeys.includes("description")}
              value={this.state.description}
              onChange={this.onChange}
            />
            <Input
              title="Valor:"
              type="currency"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              allowNegative={true}
            />
          </Block>
          <ConfirmationWindow
            isOpen={this.state.confirmationWindow}
            message="Deseja mesmo excluir este item do banco de dados?"
            leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
            rightButton={{text: "Sim", className: "button--danger", onClick: this.removeItem}}
            closeBox={this.toggleConfirmationWindow}/>
          <FooterButtons buttons={this.props.item._id ? [
            {text: "Excluir Registro", className: "button--danger", onClick: this.toggleConfirmationWindow},
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ] : [
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
      </Box>
    )
  }
}