import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class RegisterModules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',

      errorMsg: '',
      errorKeys: []
    }
  }
  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);

    this.setState({ [e.target.name]: e.target.value });
  }
  removeItem = () => {
    this.props.databaseLoading();
    Meteor.call('modules.hide', this.state._id, (err, res) => {
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
        Meteor.call('modules.update.description',
          this.props.item._id,
          this.state.description,
          (err, res) => {
            if (err) this.props.databaseFailed(err);
            if (res) this.props.databaseCompleted();
          });
      } else {
        var data = {
          description: this.state.description
        }
        Meteor.call('modules.insert', data, (err, res) => {
          if (err) this.props.databaseFailed(err);
          if (res) this.props.databaseCompleted();
        });
      }
    }
  }
  render() {
    return (
      <Box className="register-data"
        title={this.props.item._id ? "Editar Componente" : "Criar Novo Componente"}
        closeBox={this.props.toggleWindow}
        width="800px">
          <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={1}>
            <Input
              title="Descrição:"
              type="text"
              name="description"
              value={this.state.description}
              onChange={this.onChange}
            />
          </Block>
          <FooterButtons
            disabled={!tools.isWriteAllowed('modules')}
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