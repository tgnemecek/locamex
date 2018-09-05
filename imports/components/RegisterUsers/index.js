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
      pages: this.props.item.pages || [],

      pagesDatabase: [],

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
    if (!this.state.username || !this.state.emails) {
      throw new Error('required fields empty');
    }
    if (this.props.item._id) {
      Meteor.call('users.update', this.state);
    } else {
      if (!this.state.password) throw new Error('password empty');
      Meteor.call('users.insert', this.state);
    }
    this.props.toggleWindow();
  }
  render() {
    return (
      <ErrorBoundary>
        <Box
          title={this.props.item._id ? "Editar Usuário" : "Criar Novo Usuário"}
          closeBox={this.props.toggleWindow}
          width="800px">
            <Block columns={5} options={[{block: 0, span: 2}, {block: 1, span: 2}]}>
              <Input
                title="Usuário:"
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
              />
              <Input
                title="Email:"
                type="email"
                name="emails"
                value={this.state.emails}
                onChange={this.onChange}
              />
              <Input
                title="Senha:"
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
              />
            </Block>
            <PageSelection onChange={this.onChange} item={this.state} pagesDatabase={this.state.pagesDatabase}/>
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
      </ErrorBoundary>
    )
  }
}