import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

class RegisterSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      containerId: this.props.item.containerId || '',
      place: this.props.item.place || '',
      observations: this.props.item.observations || '',

      errorKeys: []
    }
  }

  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);

    this.setState({ [e.target.name]: e.target.value, errorKeys });
  }

  renderModels = () => {
    var filtered = this.props.containersDatabase.filter((model) => model.type === "fixed");
    return filtered.map((model, i) => {
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

    var errorKeys = check(['_id', 'containerId', 'place']);
    if (errorKeys.length) {
      this.setState({ errorKeys });
    } else {
      if (this.props.item._id) {
        var changes = {
          place: this.state.place,
          observations: this.state.observations
        }
        Meteor.call('series.update', changes, this.state._id);
        this.props.toggleWindow();
      } else {
        Meteor.call('series.insert', this.state, (err, res) => {
          if (err) {
            if (err.error === 'id-in-use') {
              alert(`Série #${this.state._id} já existente! Favor escolher outra série.`)
            } else alert('Erro de servidor. Tente mais tarde.')
          } else if (res) this.props.toggleWindow();
        });
      }
    }
  }

  removeItem = () => {
    Meteor.call('series.hide', this.props.item._id);
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box className="register-data"
        title={this.props.item._id ? "Editar Série" : "Adicionar Nova Série"}
        closeBox={this.props.toggleWindow}
        width="800px">
          <Block columns={3} options={[{block: 3, span: 3}]}>
            <Input
              title="Série:"
              type="digits"
              name="_id"
              error={this.state.errorKeys.includes("_id")}
              readOnly={!!this.props.item._id}
              value={this.state._id}
              onChange={this.onChange}
            />
            <Input
              title="Modelo:"
              type="select"
              name="containerId"
              error={this.state.errorKeys.includes("containerId")}
              disabled={this.props.item._id}
              value={this.state.containerId}
              onChange={this.onChange}>
                <option value=''></option>
                {this.renderModels()}
            </Input>
            <Input
              title="Pátio:"
              type="select"
              name="place"
              disabled={this.props.item.place === 'rented'}
              error={this.state.errorKeys.includes("place")}
              value={this.state.place}
              onChange={this.onChange}>
                {this.props.item.place === 'rented' ?
                  <option value='rented'>Alugado</option>
                : <option value=''></option>}
                {this.renderPlaces()}
            </Input>
            <Input
              title="Observações:"
              type="textarea"
              name="observations"
              value={this.state.observations}
              onChange={this.onChange}
            />
          </Block>
          <this.props.Footer {...this.props} saveEdits={this.saveEdits} removeItem={this.removeItem} />
      </Box>
    )
  }
}

export default RegisterSeriesWrapper = withTracker((props) => {
  Meteor.subscribe('containersPub');
  Meteor.subscribe('placesPub');
  var containersDatabase = Containers.find().fetch();
  var placesDatabase = Places.find().fetch();
  return {
    containersDatabase,
    placesDatabase
  }
})(RegisterSeries);