import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class RegisterUsers extends React.Component {
  constructor(props) {
    super(props);
    var emails;
    if (this.props.item.emails) {
      if (this.props.item.emails[0]) {
        emails = this.props.item.emails[0].address;
      } else emails = '';
    } else emails = '';
    this.state = {
      _id: this.props.item._id || '',
      firstName: this.props.item.firstName || '',
      lastName: this.props.item.lastName || '',
      username: this.props.item.username || '',

      type: this.props.item.type || 'administrator',
      emails,
      password: '',

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false
    }
  }
  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);
    
    this.setState({ [e.target.name]: e.target.value });
  }
  toggleConfirmationWindow = () => {
    var confirmationWindow = !this.state.confirmationWindow;
    this.setState({ confirmationWindow });
  }
  removeItem = () => {
    Meteor.call('users.hide', this.state._id);
    this.props.toggleWindow();
  }
  saveEdits = () => {
    var errorKeys = [];
    var errorMsg = '';
    if (!this.state.username.trim()) {
      errorKeys.push("username");
    }
    if (!this.state.firstName.trim()) {
      errorKeys.push("firstName");
    }
    if (!this.state.lastName.trim()) {
      errorKeys.push("lastName");
    }
    if (!this.state.password.trim() && !this.props.item._id) {
      errorKeys.push("password");
    }
    if (!this.state.emails || !tools.checkEmail(this.state.emails)) {
      errorKeys.push("emails");
    }
    errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';
    if (this.state.password.trim() && this.state.password.trim().length < 4) {
      errorKeys.push("password");
      errorMsg = 'A senha deve ter ao menos 4 caracteres';
    }
    if (this.state.username.trim() && this.state.username.trim().length < 3) {
      errorKeys.push("username");
      errorMsg = 'O nome de usuário deve ter ao menos 3 caracteres';
    }
    if (errorKeys.length === 0) {
      if (this.props.item._id) {
        Meteor.call('users.update', this.state);
      } else {
        Meteor.call('users.insert', this.state);
      }
      this.props.toggleWindow();
    } else this.setState({ errorMsg, errorKeys })
  }
  render() {
    return (
      <ErrorBoundary>
        <Box className="register-data"
          title={this.props.item._id ? "Editar Usuário" : "Criar Novo Usuário"}
          closeBox={this.props.toggleWindow}
          width="800px">
            <div className="error-message">{this.state.errorMsg}</div>
            <Block columns={3}>
              <Input
                title="Nome:"
                type="text"
                name="firstName"
                error={this.state.errorKeys.includes("firstName")}
                value={this.state.firstName}
                onChange={this.onChange}
              />
              <Input
                title="Sobrenome:"
                type="text"
                name="lastName"
                error={this.state.errorKeys.includes("lastName")}
                value={this.state.lastName}
                onChange={this.onChange}
              />
              <Input
                title="Email:"
                type="email"
                name="emails"
                error={this.state.errorKeys.includes("emails")}
                value={this.state.emails}
                onChange={this.onChange}
              />
              <Input
                title="Usuário:"
                type="text"
                name="username"
                error={this.state.errorKeys.includes("username")}
                value={this.state.username}
                onChange={this.onChange}
              />
              <Input
                title="Senha:"
                type="password"
                name="password"
                error={this.state.errorKeys.includes("password")}
                value={this.state.password}
                onChange={this.onChange}
              />
              <Input
                title="Tipo de Usuário"
                type="select"
                name="type"
                onChange={this.onChange}>
                <option value="administrator">Administrador</option>
                <option value="sales">Vendas</option>
                <option value="finances">Financeiro</option>
                <option value="maintenance">Manutenção</option>
              </Input>
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
      </ErrorBoundary>
    )
  }
}