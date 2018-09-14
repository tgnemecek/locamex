import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import Transaction from './Transaction/index';

export default class RegisterModules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      available: this.props.item.available || '',
      rented: this.props.item.rented || '',
      maintenance: this.props.item.maintenance || '',

      origin: '-',
      transaction: 0,
      destination: 'available',

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
    Meteor.call('modules.hide', this.state._id);
    this.props.toggleWindow();
  }
  saveEdits = () => {
    var errorKeys = [];
    function transaction (originalState) {
      var state = { ...originalState };
      if (originalState.transaction === 0) return originalState;
      if (originalState.origin === '-' && originalState.destination === '-') return originalState;

      var from = originalState.origin;
      var transactionValue = Number(originalState.transaction);
      var to = originalState.destination;

      if (from !== '-') state[from] = Number (state[from]) - transactionValue;
      if (to !== '-') state[to] = Number (state[to]) + transactionValue;

      return state;
    }
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else {
      var state = transaction(this.state);
      if (this.props.item._id) {
        Meteor.call('modules.update', state);
      } else Meteor.call('modules.insert', state);
      this.props.toggleWindow();
    }
  }
  render() {
    return (
      <Box
        title={this.props.item._id ? "Editar Componente" : "Criar Novo Componente"}
        closeBox={this.props.toggleWindow}
        width="800px">
          <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={6} options={[{block: 1, span: 5}]}>
            <Input
              title="Código:"
              type="text"
              readOnly={true}
              name="_id"
              value={this.state._id}
              onChange={this.onChange}
            />
            <Input
              title="Descrição:"
              type="text"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
            />
          </Block>
          <h4 className="register-modules__transaction__title">Movimentação de estoque:</h4>
          <Transaction item={this.state} onChange={this.onChange}/>
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