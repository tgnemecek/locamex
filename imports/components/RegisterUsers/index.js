import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import { Pages } from '/imports/api/pages/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import PageSelection from './PageSelection/index';

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
      username: this.props.item.username || '',
      emails,
      password: '',
      pages: this.props.item.profile ? this.props.item.profile.pages : [],

      pagesDatabase: [],

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false
    }
  }
  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('pagesPub');
      var pagesDatabase = Pages.find({ visible: true }).fetch();
      this.setState({ pagesDatabase });
    })
  }
  componentWillUnmount = () => {
    this.tracker.stop();
  }
  onChange = (e) => {
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
        if (!this.state.password) throw new Meteor.Error('password empty');
        Meteor.call('users.insert', this.state);
      }
      this.props.toggleWindow();
    } else this.setState({ errorMsg, errorKeys })
  }
  render() {
    return (
      <ErrorBoundary>
        <Box
          title={this.props.item._id ? "Editar Usuário" : "Criar Novo Usuário"}
          closeBox={this.props.toggleWindow}
          width="800px">
            <div className="error-message">{this.state.errorMsg}</div>
            <Block columns={5} options={[{block: 0, span: 2}, {block: 1, span: 2}]}>
              <Input
                title="Usuário:"
                type="text"
                name="username"
                style={this.state.errorKeys.includes("username") ? {borderColor: "red"} : null}
                value={this.state.username}
                onChange={this.onChange}
              />
              <Input
                title="Email:"
                type="email"
                name="emails"
                style={this.state.errorKeys.includes("emails") ? {borderColor: "red"} : null}
                value={this.state.emails}
                onChange={this.onChange}
              />
              <Input
                title="Senha:"
                type="password"
                name="password"
                style={this.state.errorKeys.includes("password") ? {borderColor: "red"} : null}
                value={this.state.password}
                onChange={this.onChange}
              />
            </Block>
            <PageSelection onChange={this.onChange} item={this.state} pagesDatabase={this.state.pagesDatabase}/>
            {this.state.confirmationWindow ?
              <Box
                title="Aviso:"
                closeBox={this.toggleConfirmationWindow}>
                <p>Deseja mesmo excluir este usuário do banco de dados?</p>
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
      </ErrorBoundary>
    )
  }
}