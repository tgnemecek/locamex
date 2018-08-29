import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class Transaction extends React.Component {
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
      <Block columns={3} options={[{block: 1, span: 0.33}, {block: 2, span: 0.33}, {block: 3, span: 0.33}]}>
        <Input
          title="Origem:"
          type="select"
          name="origin"
          value={this.state._id}
          onChange={this.onChange}>
            <option>Entrada (Compra)</option>
            <option>Disponíveis</option>
            <option>Manutenção</option>
        </Input>
        <Input
          title="Origem:"
          labelStyle={{visibility: "hidden"}}
          type="number"
          name="quantity-origin"
          disabled={true}
          style={{textAlign: "center"}}
          value={this.state.description}
          onChange={this.onChange}/>
        <div>
          <div>>></div>
          <Input
            type="number"
            name="quantity-transaction"
            style={{textAlign: "center"}}
            value={this.state.description}
            onChange={this.onChange}/>
          <div>>></div>
        </div>
        <Input
          title="Destino:"
          labelStyle={{visibility: "hidden"}}
          type="number"
          name="quantity-destination"
          disabled={true}
          style={{textAlign: "center"}}
          value={this.state.description}
          onChange={this.onChange}/>
        <Input
          title="Destino:"
          type="select"
          name="destination"
          value={this.state.description}
          onChange={this.onChange}>
            <option>Saída (Desmanche)</option>
            <option>Disponíveis</option>
            <option>Manutenção</option>
        </Input>
      </Block>
    )
  }
}