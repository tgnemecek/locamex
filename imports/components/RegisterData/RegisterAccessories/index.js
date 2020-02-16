import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import tools from '/imports/startup/tools/index';
import { Variations } from '/imports/api/variations/index';
import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';

import VariationsList from './VariationsList/index';

class RegisterAccessories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      price: this.props.item.price || 0,
      restitution: this.props.item.restitution || 0,
      observations: this.props.item.observations || '',
      variations: this.props.variations.length ?
        this.props.variations : [{
          description: "Padrão Único",
          observations: ''
        }],

      errorMsg: '',
      errorKeys: [],

      confirmationWindow: false,
      imageWindow: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.variations !== this.props.variations) {
      this.setState({ variations: this.props.variations });
    }
  }

  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);
    this.setState({ [e.target.name]: e.target.value, errorKeys });
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
      this.props.databaseLoading();
      if (this.props.item._id) {
        Meteor.call('accessories.update', this.state, (err, res) => {
          if (err) this.props.databaseFailed(err);
          if (res) this.props.databaseCompleted();
        });
      } else Meteor.call('accessories.insert', this.state, (err, res) => {
        if (err) this.props.databaseFailed(err);
        if (res) this.props.databaseCompleted();
      });
    }
  }
  render() {
    return (
      <Box className="register-data"
        title={this.props.item._id ? "Editar Acessório" : "Criar Novo Acessório"}
        closeBox={this.props.toggleWindow}>
          <div className="error-message">{this.state.errorMsg}</div>
          <div className="register-accessories__body">
            <Input
              title="Descrição:"
              type="text"
              name="description"
              disabled={!tools.isWriteAllowed('accessories')}
              error={this.state.errorKeys.includes("description")}
              value={this.state.description}
              onChange={this.onChange}
            />
            <Input
              title="Valor Mensal:"
              type="currency"
              name="price"
              disabled={!tools.isWriteAllowed('accessories')}
              value={this.state.price}
              onChange={this.onChange}
            />
            <Input
              title="Indenização:"
              type="currency"
              name="restitution"
              disabled={!tools.isWriteAllowed('accessories')}
              value={this.state.restitution}
              onChange={this.onChange}
            />
          </div>
          <VariationsList
            disabled={!tools.isWriteAllowed('accessories')}
            variations={this.state.variations}
            onChange={this.onChange}/>
          <this.props.Footer {...this.props}
            disabled={!tools.isWriteAllowed('accessories')}
            saveEdits={this.saveEdits} removeItem={this.removeItem} />
      </Box>
    )
  }
}

export default RegisterAccessoriesWrapper = withTracker((props) => {
  Meteor.subscribe('variationsPub');
  var variations = Variations.find({
    'accessory._id': props.item._id
  }).fetch() || [];
  return {
    variations
  }
})(RegisterAccessories);