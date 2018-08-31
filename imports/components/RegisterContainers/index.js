import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Modules } from '/imports/api/modules/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import Fixed from './Fixed/index';
import Modular from './Modular/index';

export default class RegisterContainers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || '',
      type: this.props.item.type || '',
      place: this.props.item.place || '',
      status: this.props.item.status || '',
      modules: this.props.item.modules || '',
      restitution: this.props.item.restitution || '',
      observations: this.props.item.observations || '',

      modulesDatabase: [],
      placesDatabase: [],

      confirmationWindow: false
    }
  }
  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('modulesPub');
      Meteor.subscribe('placesPub');
      var modulesDatabase = Modules.find({ visible: true }).fetch();
      var placesDatabase = Places.find({ visible: true }).fetch();
      this.setState({ modulesDatabase, placesDatabase });
    })
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
    if (this.props.item._id) {
      Meteor.call('containers.update', this.state);
    } else Meteor.call('containers.insert', this.state);
    this.props.toggleWindow();
  }
  render() {
    return (
      <ErrorBoundary>
        <Box
          title={this.props.item._id ? "Editar Container" : "Criar Novo Container"}
          closeBox={this.props.toggleWindow}
          width="800px">
            <Block columns={6} options={[
              {block: 1, span: 3}]}>
              <Input
                title="Código:"
                type="text"
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
              <Modular item={this.state} onChange={this.onChange} modulesDatabase={this.state.modulesDatabase}/>
              :
              <Fixed item={this.state} onChange={this.onChange} placesDatabase={this.state.placesDatabase}/>
            }
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