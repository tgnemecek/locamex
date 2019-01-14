import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Modules } from '/imports/api/modules/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import Fixed from './Fixed/index';
import Modular from './Modular/index';

export default class RegisterContainers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      serial: this.props.item.serial || '',
      description: this.props.item.description || '',
      price: this.props.item.price || '',
      type: this.props.item.type || 'fixed',
      place: this.props.item.place || '0000',
      status: this.props.item.status || 'available',
      modules: this.props.item.modules || [],
      restitution: this.props.item.restitution || '',
      observations: this.props.item.observations || '',

      modulesDatabaseFull: [],
      modulesDatabaseFiltered: [],
      placesDatabase: [],

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false
    }
  }
  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('modulesPub');
      Meteor.subscribe('placesPub');
      var modulesDatabaseFull = Modules.find().fetch();
      var modulesDatabaseFiltered = modulesDatabaseFull;
      var placesDatabase = Places.find().fetch();
      this.setState({ modulesDatabaseFull, modulesDatabaseFiltered, placesDatabase });
    })
  }
  componentWillUnmount = () => {
    this.tracker.stop();
  }
  searchReturn = (modulesDatabaseFiltered) => {
    if (modulesDatabaseFiltered) {
      this.setState({ modulesDatabaseFiltered });
    } else this.setState({ modulesDatabaseFiltered: this.state.modulesDatabaseFull });
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
    Meteor.call('containers.hide', this.state._id);
    this.props.toggleWindow();
  }
  saveEdits = () => {
    var errorKeys = [];
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else if (!this.state.serial.trim() && this.state.type === 'fixed') {
      errorKeys.push("serial");
      this.setState({ errorMsg: "Favor informar uma série.", errorKeys });
    } else {
      if (this.props.item._id) {
        Meteor.call('containers.update', this.state);
      } else Meteor.call('containers.insert', this.state);
      this.props.toggleWindow();
    }
  }
  render() {
    return (
      <Box
        title={this.props.item._id ? "Editar Container" : "Criar Novo Container"}
        closeBox={this.props.toggleWindow}
        width="800px">
        <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={6} options={[
            {block: 1, span: 2}]}>
            <Input
              title="Série:"
              type="text"
              name="serial"
              readOnly={this.state.type === 'modular'}
              value={this.state.serial}
              onChange={this.onChange}
            />
            <Input
              title="Descrição:"
              type="text"
              name="description"
              style={this.state.errorKeys.includes("description") ? {borderColor: "red"} : null}
              value={this.state.description}
              onChange={this.onChange}
            />
            <Input
              title="Tipo:"
              type="select"
              name="type"
              disabled={!!this.props.item._id}
              value={this.state.type}
              onChange={this.onChange}>
                <option value="fixed">Fixo</option>
                <option value="modular">Modular</option>
            </Input>
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
          {this.state.type === 'modular' ?
            <Modular
              item={this.state}
              onChange={this.onChange}
              searchReturn={this.searchReturn}
              modulesDatabase={this.state.modulesDatabaseFiltered}/>
            :
            <Fixed item={this.state} onChange={this.onChange} placesDatabase={this.state.placesDatabase}/>
          }
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