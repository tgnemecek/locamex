import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Categories } from '/imports/api/categories/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';
import Transaction from './Transaction/index';

export default class RegisterAccessories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || 0,
      category: this.props.item.category || '',
      place: this.props.item.place || '',
      available: this.props.item.available || '',
      maintenance: this.props.item.maintenance || '',
      restitution: this.props.item.restitution || 0,
      observations: this.props.item.observations || '',

      origin: '-',
      transaction: 0,
      destination: '-',

      categoriesDatabase: [],
      placesDatabase: [],

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false
    }
  }
  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('categoriesPub');
      Meteor.subscribe('placesPub');
      var categoriesDatabase = Categories.find({ visible: true }).fetch();
      var placesDatabase = Places.find({ visible: true }).fetch();
      this.setState({ categoriesDatabase, placesDatabase });
    })
  }
  componentWillUnmount = () => {
    this.tracker.stop();
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
    Meteor.call('accessories.hide', this.state._id);
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
        Meteor.call('accessories.update', state);
      } else Meteor.call('accessories.insert', state);
      this.props.toggleWindow();
    }
  }
  render() {
    return (
      <Box
        title={this.props.item._id ? "Editar Acessório" : "Criar Novo Acessório"}
        closeBox={this.props.toggleWindow}
        width="800px">
          <div className="error-message">{this.state.errorMsg}</div>
          <Block columns={6} options={[
            {block: 1, span: 4},
            {block: 3, span: 2},
            {block: 4, span: 3}]}>
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
              title="Categoria:"
              type="select"
              name="category"
              value={this.state.category}
              onChange={this.onChange}>
                {this.renderOptions("categoriesDatabase")}
            </Input>
            <Input
              title="Pátio:"
              type="select"
              name="place"
              value={this.state.place}
              onChange={this.onChange}>
                {this.renderOptions("placesDatabase")}
            </Input>
            <Input
              title="Indenização:"
              type="currency"
              name="restitution"
              value={this.state.restitution}
              onChange={this.onChange}
            />
          </Block>
          <h4 className="register-accessories__transaction__title">Movimentação de estoque:</h4>
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