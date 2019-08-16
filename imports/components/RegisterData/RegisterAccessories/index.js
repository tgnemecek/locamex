import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

import Variations from './Variations/index';

export default class RegisterAccessories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || 0,
      restitution: this.props.item.restitution || 0,
      observations: this.props.item.observations || '',
      variations: this.props.item.variations || [{
        _id: tools.generateId(),
        observations: '',
        rented: 0,
        place: [],
        visible: true
      }],

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false,
      imageWindow: false
    }
  }
  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);
    this.setState({ [e.target.name]: e.target.value, errorKeys });
  }
  onChangeVariations = (e) => {
    var bool = e.target.value;
    var variations;
    function emptyVariation() {
      return {
        _id: tools.generateId(),
        observations: '',
        rented: 0,
        place: [],
        visible: true
      }
    }
    if (bool) {
      variations = [emptyVariation(), emptyVariation()];
    } else variations = [emptyVariation()];

    this.setState({ variations });
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
    if (!this.state.description.trim()) {
      errorKeys.push("description");
      this.setState({ errorMsg: "Favor informar uma descrição.", errorKeys });
    } else {
      if (this.props.item._id) {
        Meteor.call('accessories.update', this.state);
      } else Meteor.call('accessories.insert', this.state);
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
          <Block columns={4} options={[
            {block: 0, span: 2},
            {block: 3, span: 2},
            {block: 4, span: 2},
            {block: 5, span: 4}
          ]}>
            <Input
              title="Descrição:"
              type="text"
              name="description"
              error={this.state.errorKeys.includes("description")}
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
            <Input
              title="Observações:"
              type="textarea"
              name="observations"
              value={this.state.observations}
              onChange={this.onChange}
            />
            <Input
              title="Apresenta Variações:"
              type="checkbox"
              name="variations"
              id="variations"
              value={this.state.variations.length > 1}
              onChange={this.onChangeVariations}
            />
            <Variations variations={this.state.variations} onChange={this.onChange} />
          </Block>
          <this.props.Footer {...this.props} saveEdits={this.saveEdits} removeItem={this.removeItem} />
      </Box>
    )
  }
}