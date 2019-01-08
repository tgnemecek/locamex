import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class RegisterModules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      place: this.props.item.place || [],
      quantitative: true,

      totalItems: 0,

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false
    }
  }
  componentDidMount() {
    this.setState({ totalItems: this.calculateTotalItems() })
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  calculateTotalItems = () => {
    if (this.props.item.quantitative) {
      var totalAvailable = 0;
      var totalMaintenance = 0;

      var placesInItem = tools.deepCopy(this.state.place);

      placesInItem.forEach((place) => {
        // Calculate totals
        totalAvailable = totalAvailable + place.available;
        totalMaintenance = totalMaintenance + place.maintenance;
      })
      // Calculate grand total
      return totalAvailable + totalMaintenance;
    }
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
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else if (this.calculateTotalItems() !== this.state.totalItems) {
      errorKeys.push("totalItems");
      this.setState({ errorMsg: "As quantidades somadas devem equivaler ao total.", errorKeys });
    } else {
      if (this.props.item._id) {
        Meteor.call('modules.update', this.state);
      } else Meteor.call('modules.insert', this.state);
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
          <Block columns={1}>
            <Input
              title="Descrição:"
              type="text"
              name="description"
              value={this.state.description}
              onChange={this.onChange}/>
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