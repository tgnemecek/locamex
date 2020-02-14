import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import { userTypes } from '/imports/startup/user-types/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class RegisterUsers extends React.Component {
  constructor(props) {
    super(props);
    var item = this.props.item;
    var email = (item.emails && item.emails[0]) ?
      item.emails[0].address : '';
    this.state = {
      _id: item._id || '',
      username: item.username || '',
      email,
      password: '',
      profile: {
        firstName: item.profile ? item.profile.firstName : '',
        lastName: item.profile ? item.profile.lastName : '',
        type: item.profile ? item.profile.type : 'administrator',
      },
      errorMsg: '',
      errorKeys: [],
      confirmationWindow: false,
      databaseStatus: false
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  onChangeProfile = (e) => {
    var profile = {
      ...this.state.profile,
      [e.target.name]: e.target.value
    }
    this.setState({ profile });
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
    var errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';
    if (!this.state.username.trim()) {
      errorKeys.push("username");
    }
    if (!this.state.profile.firstName.trim()) {
      errorKeys.push("firstName");
    }
    if (!this.state.profile.lastName.trim()) {
      errorKeys.push("lastName");
    }
    if (!this.props.item._id) {
      if (!this.state.password.trim() && !this.props.item._id) {
        errorKeys.push("password");
      }
      if (this.state.password.length < 4) {
        errorKeys.push("password");
        errorMsg = 'A senha deve ter ao menos 4 caracteres';
      }
    }
    if (!this.state.email || !tools.checkEmail(this.state.email)) {
      errorKeys.push("email");
    }
    if (this.state.username.trim() && this.state.username.trim().length < 4) {
      errorKeys.push("username");
      errorMsg = 'O nome de usuário deve ter ao menos 4 caracteres';
    }
    if (errorKeys.length) {
      this.setState({ errorMsg, errorKeys });
      return;
    }
    this.props.databaseLoading();
    if (this.props.item._id) {
      Meteor.call('users.update', this.state, (err, res) => {
        if (err) this.props.databaseFailed(err);
        if (res) this.props.databaseCompleted();
      });
    } else {
      Meteor.call('users.insert', this.state, (err, res) => {
        if (err) this.props.databaseFailed(err);
        if (res) this.props.databaseCompleted();
      });
    }
  }
  renderUserTypesOptions = () => {
    var array = Object.keys(userTypes);
    array.sort();
    return array.map((key, i) => {
      return (
        <option
          key={i}
          value={key}>
            {userTypes[key].label}
        </option>
      )
    })
  }
  render() {
    return (
      <ErrorBoundary>
        <Box className="register-data"
          title={this.props.item._id ? "Editar Usuário" : "Criar Novo Usuário"}
          closeBox={this.props.toggleWindow}>
            <div className="error-message">{this.state.errorMsg}</div>
            <Block columns={3}>
              <Input
                title="Nome:"
                type="text"
                name="firstName"
                error={this.state.errorKeys.includes("firstName")}
                value={this.state.profile.firstName}
                onChange={this.onChangeProfile}
              />
              <Input
                title="Sobrenome:"
                type="text"
                name="lastName"
                error={this.state.errorKeys.includes("lastName")}
                value={this.state.profile.lastName}
                onChange={this.onChangeProfile}
              />
              <Input
                title="Email:"
                type="email"
                name="email"
                error={this.state.errorKeys.includes("email")}
                value={this.state.email}
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
                disabled={!!this.props.item._id}
              />
              <Input
                title="Tipo de Usuário"
                type="select"
                name="type"
                value={this.state.profile.type}
                onChange={this.onChangeProfile}>
                {this.renderUserTypesOptions()}
              </Input>
            </Block>
            {/* <ConfirmationWindow
              isOpen={this.state.confirmationWindow}
              message="Deseja mesmo excluir este item do banco de dados?"
              leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
              rightButton={{text: "Sim", className: "button--danger", onClick: this.removeItem}}
              closeBox={this.toggleConfirmationWindow}/> */}
            <FooterButtons buttons={[
              {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
              {text: "Salvar", onClick: this.saveEdits}
            ]}/>
        </Box>
      </ErrorBoundary>
    )
  }
}