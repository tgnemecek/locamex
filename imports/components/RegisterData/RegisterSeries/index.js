import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

class RegisterSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      description: this.props.item.description || '',
      container: this.props.item.container || {
        _id: '',
        description: ''
      },
      place: this.props.item.place || {
        _id: '',
        description: ''
      },
      observations: this.props.item.observations || '',

      errorKeys: [],
      databaseStatus: false
    }
  }

  onChange = (e) => {
    var errorKeys = [...this.state.errorKeys];
    var fieldIndex = errorKeys.findIndex((key) => key === e.target.name);
    errorKeys.splice(fieldIndex, 1);

    this.setState({ [e.target.name]: e.target.value, errorKeys });
  }

  onChangeContainer = (e) => {
    var _id = e.target.value;
    var container = this.props.containersDatabase.find((container) => {
      return container._id === _id;
    }) || {};
    this.setState({ container });
  }

  onChangePlace = (e) => {
    var _id = e.target.value;
    var place = this.props.placesDatabase.find((place) => {
      return place._id === _id;
    }) || {};
    this.setState({ place });
  }

  renderModels = () => {
    return this.props.containersDatabase
      .filter((model) => model.type === "fixed")
      .map((model, i) => {
        return <option key={i} value={model._id}>{model.description}</option>
      })
  }

  renderPlaces = () => {
    return this.props.placesDatabase.map((place, i) => {
      return <option key={i} value={place._id}>{place.description}</option>
    })
  }

  saveEdits = () => {
    var errorKeys = [];
    if (!this.state.description) {
      errorKeys.push('description');
    }
    if (!this.state.container._id) {
      errorKeys.push('container._id');
    }
    if (!this.state.place._id) {
      errorKeys.push('place._id');
    }
    if (errorKeys.length) {
      this.setState({ errorKeys });
      return;
    }
    this.props.databaseLoading();
    if (this.props.item._id) {
      Meteor.call('series.update', this.state, (err, res) => {
        if (err) this.props.databaseFailed(err);
        if (res) this.props.databaseCompleted();
      })
    } else {
      Meteor.call('series.insert', this.state, (err, res) => {
        if (err) this.props.databaseFailed(err);
        if (res) this.props.databaseCompleted();
      })
    }
  }

  deleteSeries = () => {
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('series.delete', this.props.item._id, (err, res) => {
        if (err) {
          if (err.error === "id-in-use") {
            this.setState({ databaseStatus: {
              status: "failed",
              message: "Série já em uso! " + err.reason
            } });
          } else {
            this.setState({ databaseStatus: "failed" });
          }
        }
        if (res) {
          this.setState({ databaseStatus: {
            status: "completed",
            callback: this.props.toggleWindow
          }})
        }
      });
    })
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
              type="number"
              name="description"
              error={this.state.errorKeys.includes("description")}
              disabled={!!this.props.item._id || !tools.isWriteAllowed('series')}
              value={this.state.description}
              onChange={this.onChange}
            />
            <Input
              title="Modelo:"
              type="select"
              error={this.state.errorKeys.includes("container._id")}
              disabled={this.props.item._id || !tools.isWriteAllowed('series')}
              value={this.state.container._id}
              onChange={this.onChangeContainer}>
                <option value=''></option>
                {this.renderModels()}
            </Input>
            <Input
              title="Pátio:"
              type="select"
              disabled={this.props.item
                && this.props.item.rented
                || !tools.isWriteAllowed('series')}
              error={this.state.errorKeys.includes("place._id")}
              value={this.state.place._id}
              onChange={this.onChangePlace}>
              <option value=''>
                {this.props.item && this.props.item.rented ?
                  "Alugado" : ""}
              </option>
                {this.renderPlaces()}
            </Input>
            <Input
              title="Observações:"
              type="textarea"
              name="observations"
              disabled={!tools.isWriteAllowed('series')}
              value={this.state.observations}
              onChange={this.onChange}
            />
          </Block>
          <FooterButtons
            disabled={!tools.isWriteAllowed('series')}
            buttons={this.props.item._id ?
              [
                {text: "Excluir Registro", className: "button--danger", onClick: this.deleteSeries},
                {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
                {text: "Salvar", onClick: this.saveEdits}
              ]
            :
            [
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
  var containersDatabase = Containers.find().fetch() || [];
  var placesDatabase = Places.find().fetch() || [];
  return {
    containersDatabase,
    placesDatabase
  }
})(RegisterSeries);