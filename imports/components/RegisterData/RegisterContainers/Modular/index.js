import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';

import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import ModuleList from './ModuleList/index';

export default class Modular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || '',
      restitution: this.props.item.restitution || '',
      allowedModules: this.props.item.allowedModules || [],

      errorMsg: '',
      errorKeys: []
    }
  }
  renderOptions = (database) => {
    return this.state[database].map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }
  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);

    this.setState({ [e.target.name]: e.target.value });
  }
  removeItem = () => {
    this.props.databaseLoading();
    Meteor.call('containers.hide', this.props.item._id, (err, res) => {
      if (err) this.props.databaseFailed(err);
      if (res) this.props.databaseCompleted();
    });
  }
  saveEdits = () => {
    var errorKeys = [];
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else {
      this.props.databaseLoading();
      if (this.props.item._id) {
        Meteor.call('containers.modular.update', this.state, (err, res) => {
          if (err) this.props.databaseFailed(err);
          if (res) this.props.databaseCompleted();
        });
      } else {
        Meteor.call('containers.modular.insert', this.state, (err, res) => {
          if (err) this.props.databaseFailed(err);
          if (res) this.props.databaseCompleted();
        });
      }
    }
  }
  render() {
    return (
      <Box className="register-data"
        title={this.props.item._id ? "Editar Container Modular" : "Criar Novo Container Modular"}
        closeBox={this.props.toggleWindow}
        width="800px">
        <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={4} options={[{block: 0, span: 2}]}>
            <Input
              title="Descrição:"
              type="text"
              name="description"
              error={this.state.errorKeys.includes("description")}
              value={this.state.description}
              onChange={this.onChange}
            />
            <Input
              title="Valor Mensal:"
              type="currency"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
            />
            <Input
              title="Indenização:"
              type="currency"
              name="restitution"
              value={this.state.restitution}
              onChange={this.onChange}
            />
          </Block>
          <ModuleList
            item={this.state}
            onChange={this.onChange}
            searchReturn={this.searchReturn}
            modulesDatabase={this.state.modulesDatabaseFiltered}/>
          <ConfirmationWindow
            isOpen={this.state.confirmationWindow}
            closeBox={this.toggleConfirmationWindow}
            message="Deseja mesmo excluir este item do banco de dados?"
            leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
            rightButton={{text: "Sim", className: "button--danger", onClick: this.removeItem}}/>
            <FooterButtons
              disabled={!tools.isWriteAllowed('containers')}
              buttons={this.props.item._id ?
                [
                  {text: "Excluir Registro",
                  className: "button--danger",
                  onClick: () => this.props.toggleConfirmationWindow(this.removeItem)},
                  {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
                  {text: "Salvar", onClick: this.saveEdits}
                ]
              :
              [
                {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
                {text: "Salvar", onClick: this.saveEdits}
              ]}/>
      </Box>
    )
  }
}