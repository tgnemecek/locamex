import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class Quantitative extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: '-',
      transaction: 0,
      destination: 'available',

      available: this.props.item.available || 0,
      maintenance: this.props.item.maintenance || 0,
      inactive: this.props.item.inactive || 0,
    }
  }

  displayQuantities = (side) => {
    if (this.state[side] === '-') return '-';
    var key = this.state[side];
    return this.state[key];
  }
  calcMax = () => {
    if (this.state.origin === '-') return 999;
    return this.state[this.state.origin];
  }
  onChangeWhere = (e) => {
    var where = e.target.value;
    var side = e.target.name;
    var maxQuantity = this.state[where];
    var transaction = this.state.transaction;
    if (side == 'origin' && transaction > maxQuantity) {
      transaction = maxQuantity;
    }
    this.setState({ transaction, [side]: where });
  }

  onChangeTransaction = (e) => {
    this.setState({ transaction: e.target.value });
  }
  saveEdits = () => {
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
    var state = transaction(this.state);
    var type = this.props.item.type;
    state._id = this.props.item._id;

    if (type === "module") {
      Meteor.call('modules.transaction', state);
    } else if (type === "accessory") {
      Meteor.call('accessories.transaction', state);
    }
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box
        title={"Movimentação: " + this.props.item.description}
        closeBox={this.props.toggleWindow}
        width="800px">
        <Block columns={3} options={[{block: 1, span: 0.33}, {block: 2, span: 0.33}, {block: 3, span: 0.33}]}>
          <Input
            title="Origem:"
            type="select"
            name="origin"
            value={this.state.origin}
            onChange={this.onChangeWhere}>
              <option value="-">Entrada (Compra)</option>
              <option value="available">Disponíveis</option>
              <option value="maintenance">Manutenção</option>
              <option value="inactive">Inativos</option>
          </Input>
          <Input
            title="Origem:"
            labelStyle={{visibility: "hidden"}}
            type="text"
            name="quantity-origin"
            readOnly={true}
            style={{textAlign: "center"}}
            value={this.displayQuantities("origin")}/>
          <div>
            <div>>></div>
            <Input
              type="number"
              max={this.calcMax()}
              name="quantity-transaction"
              style={{textAlign: "center"}}
              value={this.state.transaction}
              onChange={this.onChangeTransaction}/>
            <div>>></div>
          </div>
          <Input
            title="Destino:"
            labelStyle={{visibility: "hidden"}}
            type="text"
            name="quantity-destination"
            readOnly={true}
            style={{textAlign: "center"}}
            value={this.displayQuantities("destination")}/>
          <Input
            title="Destino:"
            type="select"
            name="destination"
            value={this.state.destination}
            onChange={this.onChangeWhere}>
              <option value="available">Disponíveis</option>
              <option value="maintenance">Manutenção</option>
              <option value="inactive">Inativos</option>
              <option value="-">Saída (Desmanche)</option>
          </Input>
        </Block>
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Realizar Movimentação", onClick: this.saveEdits}
        ]}/>
      </Box>
    )
  }
}