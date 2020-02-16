import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class RegisterAccounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || "",
      description: this.props.item.description || "",
      bank: this.props.item.bank || "",
      bankNumber: this.props.item.bankNumber || "",
      number: this.props.item.number || "",
      branch: this.props.item.branch || "",

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
    Meteor.call('services.hide', this.state._id);
    this.props.toggleWindow();
  }
  saveEdits = () => {
    var errorKeys = [];
    if (!this.state.description.trim()) errorKeys.push("description");
    if (!this.state.bank.trim()) errorKeys.push("bank");
    if (!this.state.bankNumber.trim()) errorKeys.push("bankNumber");
    if (!this.state.number.trim()) errorKeys.push("number");
    if (!this.state.branch.trim()) errorKeys.push("branch");
    if (errorKeys.length) {
      this.setState({ errorKeys });
      return;
    }
    if (this.props.item._id) {
      Meteor.call('accounts.update', this.state, (err, res) => {
        if (err) this.props.databaseFailed(err);
        if (res) this.props.databaseCompleted();
      });
    } else Meteor.call('accounts.insert', this.state, (err, res) => {
      if (err) this.props.databaseFailed(err);
      if (res) this.props.databaseCompleted();
    });
  }
  render() {
    return (
      <Box className="register-data"
        title={this.props.item._id ? "Editar Conta" : "Adicionar Nova Conta"}
        closeBox={this.props.toggleWindow}
        width="600px">
          <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={3} options={[{block: 0, span: 2}]}>
            <Input
              title="Nome da Conta:"
              type="text"
              name="description"
              error={this.state.errorKeys.includes("description")}
              value={this.state.description}
              onChange={this.onChange}
            />
            <Input
              title="Nome do Banco:"
              type="text"
              name="bank"
              error={this.state.errorKeys.includes("bank")}
              value={this.state.bank}
              onChange={this.onChange}
            />
            <Input
              title="Número do Banco:"
              type="text"
              name="bankNumber"
              error={this.state.errorKeys.includes("bankNumber")}
              value={this.state.bankNumber}
              onChange={this.onChange}
            />
            <Input
              title="Agência:"
              type="text"
              name="branch"
              error={this.state.errorKeys.includes("branch")}
              value={this.state.branch}
              onChange={this.onChange}
            />
            <Input
              title="Número da Conta:"
              type="text"
              name="number"
              error={this.state.errorKeys.includes("number")}
              value={this.state.number}
              onChange={this.onChange}
            />
          </Block>
          <ConfirmationWindow
            isOpen={this.state.confirmationWindow}
            message="Deseja mesmo excluir este item do banco de dados?"
            leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
            rightButton={{text: "Sim", className: "button--danger", onClick: this.removeItem}}
            closeBox={this.toggleConfirmationWindow}/>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
      </Box>
    )
  }
}