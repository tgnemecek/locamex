import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class RegisterServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || '',
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
    if (this.props.item._id) {
      Meteor.call('services.update', this.state._id, this.state.description, this.state.price);
    } else Meteor.call('services.insert', this.state.description, this.state.price);
    this.props.toggleWindow();
  }
  render() {
    return (
      <Box
        title={this.props.item._id ? "Editar Registro" : "Criar Novo Registro"}
        closeBox={this.props.toggleWindow}
        width="800px">
          <Block columns={6} options={[{block: 1, span: 4}]}>
            <Input
              title="Código:"
              type="text"
              disabled={true}
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
            <Input
              title="Valor:"
              type="currency"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
            />
          </Block>
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