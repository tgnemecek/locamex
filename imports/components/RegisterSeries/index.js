import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Places } from '/imports/api/places/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

class RegisterSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      serial: this.props.item.serial || 0,
      model: this.props.item.model || '',
      place: this.props.item.place || '',
      observations: this.props.item.observations || '',

      errorKeys: []
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderModels = () => {
    return this.props.modelsDatabase.map((model, i) => {
      return <option key={i} value={model._id}>{model.description}</option>
    })
  }

  renderPlaces = () => {
    return this.props.placesDatabase.map((place, i) => {
      return <option key={i} value={place._id}>{place.description}</option>
    })
  }

  saveEdits = () => {

    const check = (keys) => {
      var errorKeys = [];
      keys.forEach((key) => {
        if (!this.state[key]) errorKeys.push(key);
      })
      return errorKeys;
    }

    var errorKeys = check(['serial', 'model', 'place']);
    if (errorKeys.length) {
      this.setState({ errorKeys });
    } else {
      if (this.props.item._id) {
        Meteor.call('series.update', this.state);
      } else {
        Meteor.call('series.insert', this.state);
      }
      this.props.toggleWindow();
    }
  }

  render() {
    return (
      <Box
        title="Adicionar Nova Série"
        closeBox={this.props.toggleWindow}
        width="800px">
          <Block columns={6} options={[{block: 2, span: 2}, {block: 3, span: 2}]}>
            <Input
              title="Série:"
              type="number"
              name="serial"
              style={this.state.errorKeys.includes("serial") ? {borderColor: "red"} : null}
              value={this.state.serial}
              onChange={this.onChange}
            />
            <Input
              title="Modelo:"
              type="select"
              name="model"
              style={this.state.errorKeys.includes("model") ? {borderColor: "red"} : null}
              value={this.state.description}
              onChange={this.onChange}>
                <option value=''></option>
                {this.renderModels()}
            </Input>
            <Input
              title="Pátio:"
              type="select"
              name="place"
              style={this.state.errorKeys.includes("place") ? {borderColor: "red"} : null}
              value={this.state.price}
              onChange={this.onChange}>
                <option value=''></option>
                {this.renderPlaces()}
            </Input>
            <Input
              title="Observações:"
              type="text"
              name="observations"
              value={this.state.observations}
              onChange={this.onChange}
            />
          </Block>
          <FooterButtons buttons={[
            {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
            {text: "Salvar", onClick: this.saveEdits}
          ]}/>
      </Box>
    )
  }
}

export default RegisterSeriesWrapper = withTracker((props) => {
  Meteor.subscribe('containersPub');
  Meteor.subscribe('placesPub');
  var modelsDatabase = Containers.find().fetch();
  var placesDatabase = Places.find().fetch();
  return {
    modelsDatabase,
    placesDatabase
  }
})(RegisterSeries);