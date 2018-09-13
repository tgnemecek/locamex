import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class Transaction extends React.Component {
  displayQuantities = (key) => {
    if (key === 'origin') {
      key = this.props.item.origin;
    } else if (key === 'destination') key = this.props.item.destination;
    if (key === '-') return '-';
    return this.props.item[key];
  }
  calcMax = () => {
    if (this.props.item.origin === '-') return 999;
    return this.props.item[this.props.item.origin];
  }

  onChangeEntryDestination = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    var quantity = this.props.item[value];
    if (key == 'origin' && this.props.item.transaction > quantity) {
      this.props.onChange({target: {name: "transaction", value: quantity}});
    }
    this.props.onChange(e);
  }

  onChangeTransaction = (e) => {
    var value = e.target.value;
    this.props.onChange({target: {name: "transaction", value}});
  }
  render() {
    return (
      <Block columns={3} options={[{block: 1, span: 0.33}, {block: 2, span: 0.33}, {block: 3, span: 0.33}]}>
        <Input
          title="Origem:"
          type="select"
          name="origin"
          value={this.props.item.origin}
          onChange={this.onChangeEntryDestination}>
            <option value="-">Entrada (Compra)</option>
            <option value="available">Disponíveis</option>
            <option value="maintenance">Manutenção</option>
        </Input>
        <Input
          title="Origem:"
          labelStyle={{visibility: "hidden"}}
          type="text"
          name="quantity-origin"
          readOnly={true}
          style={{textAlign: "center"}}
          value={this.displayQuantities("origin")}
          onChange={this.onChange}/>
        <div>
          <div>>></div>
          <Input
            type="number"
            max={this.calcMax()}
            name="quantity-transaction"
            style={{textAlign: "center"}}
            value={this.props.item.transaction}
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
          value={this.displayQuantities("destination")}
          onChange={this.onChange}/>
        <Input
          title="Destino:"
          type="select"
          name="destination"
          value={this.props.item.destination}
          onChange={this.onChangeEntryDestination}>
            <option value="-">Saída (Desmanche)</option>
            <option value="available">Disponíveis</option>
            <option value="maintenance">Manutenção</option>
        </Input>
      </Block>
    )
  }
}