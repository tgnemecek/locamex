import React from 'react';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class UserSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      errorMsg: '',
      databaseStatus: false
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  saveEdits = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (this.state.newPassword1 !== this.state.newPassword2) {
      this.setState({ errorMsg: 'As senhas devem ser iguais.' })
      return;
    }
    if (this.state.newPassword1.length < 5) {
      this.setState({
        errorMsg: 'A senha deve ter ao menos 4 caracteres'
      })
      return;
    }
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('users.setPassword',
        this.state.oldPassword,
        this.state.newPassword1,
        Meteor.userId(),
        (err, res) => {
          if (err) {
            console.log(err);
            this.setState({databaseStatus: {
              status: "failed",
              message: "Erro: " + tools.translateError(err)
            }})
          }
          if (res) {
            this.setState({ databaseStatus: {
              status: "completed",
              callback: this.props.toggleWindow
            } })
          }
        }
      )
    })

  }

  render() {
    return (
      <Box
        title="Alterar Senha"
        className="user-settings"
        closeBox={this.props.toggleWindow}>
        <div className="error-message">{this.state.errorMsg}</div>
        <form onSubmit={this.saveEdits}>
          <Input
            title="Senha Atual"
            type="password"
            name="oldPassword"
            value={this.state.oldPassword}
            onChange={this.onChange}
          />
          <Input
            title="Nova Senha"
            type="password"
            name="newPassword1"
            value={this.state.newPassword1}
            onChange={this.onChange}
          />
          <Input
            title="Repita Nova Senha"
            type="password"
            name="newPassword2"
            value={this.state.newPassword2}
            onChange={this.onChange}
          />
          <FooterButtons buttons={[
            {text: "Salvar Alterações", type: "submit"}]}
          />
        </form>
        <DatabaseStatus status={this.state.databaseStatus}/>
      </Box>
    )
  }
}