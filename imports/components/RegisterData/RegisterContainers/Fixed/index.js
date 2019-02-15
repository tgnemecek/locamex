import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

class Fixed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || '',
      restitution: this.props.item.restitution || '',

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false
    }
  }
  renderOptions = (database) => {
    return this.state[database].map((item, i) => {
      return <option key={i} value={item._id}>{item.description}</option>
    })
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  toggleConfirmationWindow = () => {
    var confirmationWindow = !this.state.confirmationWindow;
    this.setState({ confirmationWindow });
  }
  removeItem = () => {
    Meteor.call('containers.hide', this.props.item._id);
    this.props.toggleWindow();
  }
  saveEdits = () => {
    var errorKeys = [];
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else {
      if (this.props.item._id) {
        Meteor.call('containers.fixed.update', this.state);
      } else Meteor.call('containers.fixed.insert', this.state);
      this.props.toggleWindow();
    }
  }
  render() {
    return (
      <Box
        title={this.props.item._id ? "Editar Container Fixo" : "Criar Novo Container Fixo"}
        closeBox={this.props.toggleWindow}
        width="800px">
        <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={4} options={[{block: 0, span: 2}]}>
            <Input
              title="Descrição:"
              type="text"
              name="description"
              style={this.state.errorKeys.includes("description") ? {borderColor: "red"} : null}
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
          <ConfirmationWindow
            isOpen={this.state.confirmationWindow}
            closeBox={this.toggleConfirmationWindow}
            message="Deseja mesmo excluir este item do banco de dados?"
            leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
            rightButton={{text: "Sim", className: "button--danger", onClick: this.removeItem}}/>
          <FooterButtons buttons={this.props.item._id ? [
            {text: "Excluir Registro", className: "button button--danger", onClick: this.toggleConfirmationWindow},
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ] : [
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
      </Box>
    )
  }
}

export default FixedWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  return {
    placesDatabase
  }
})(Fixed);