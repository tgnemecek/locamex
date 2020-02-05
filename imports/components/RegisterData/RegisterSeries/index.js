import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import FooterButtons from '/imports/components/FooterButtons/index';

class RegisterSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: this.props.item._id || '',
      containerId: this.props.item.containerId || '',
      placeId: this.props.item.placeId || '',
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

    var errorKeys = check(['_id', 'containerId', 'placeId']);
    if (errorKeys.length) {
      this.setState({ errorKeys });
    } else {
      if (this.props.item._id) {
        var changes = {
          placeId: this.state.placeId,
          observations: this.state.observations
        }
        this.setState({ databaseStatus: "loading" }, () => {
          Meteor.call('series.update', changes, this.state._id, (err, res) => {
            if (err) {
              console.log(err);
              this.setState({ databaseStatus: "failed" });
            }
            if (res) {
              this.setState({ databaseStatus: {
                status: "completed",
                callback: this.props.toggleWindow
              }})
            }
          });
        })

      } else {
        this.setState({ databaseStatus: "loading" }, () => {
          Meteor.call('series.insert', this.state, (err, res) => {
            if (err) {
              var message = err.error === 'id-in-use' ? `Série #${this.state._id} já existente! Favor escolher outra série.` : "";
              this.setState({ databaseStatus: {
                status: "failed",
                message,
                timeout: 3000
              } });
            } else if (res) {
              this.setState({ databaseStatus: {
                status: "completed",
                callback: this.props.toggleWindow
              }})
            }
          });
        })
      }
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
              name="placeId"
              disabled={this.props.item.placeId === 'rented'}
              error={this.state.errorKeys.includes("placeId")}
              value={this.state.placeId}
              onChange={this.onChange}>
                {this.props.item.placeId === 'rented' ?
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
          <FooterButtons
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
          <DatabaseStatus status={this.state.databaseStatus} />
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