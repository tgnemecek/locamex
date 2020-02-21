import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Places } from '/imports/api/places/index';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import ModulesList from './ModulesList/index'

class RegisterPacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {
        _id: this.props.item.place._id,
        description: this.props.item.place.description
      },
      observations: this.props.item.observations
    }
  }
  renderPlaces = () => {
    return this.props.placesDatabase.map((place, i) => {
      return <option key={i} value={place._id}>{place.description}</option>
    })
  }
  onChangePlace = (e) => {
    var _id = e.target.value;
    var place = this.props.placesDatabase.find((item) => {
      return item._id === _id;
    }) || {}
    this.setState({ place });
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  saveEdits = () => {
    this.props.databaseLoading();
    var data = {
      place: this.state.place,
      observations: this.state.observations
    }
    Meteor.call('packs.update',
    this.props.item._id,
    data,
    (err, res) => {
      if (err) this.props.databaseFailed(err);
      if (res) this.props.databaseCompleted();
    })
  }
  unmountPack = () => {
    this.props.databaseLoading();
    Meteor.call('packs.unmount',
    this.props.item._id,
    this.state.place,
    (err, res) => {
      if (err) this.props.databaseFailed(err);
      if (res) this.props.databaseCompleted();
    })
  }
  render() {
    return (
      <Box className="register-data register-packs"
        title="Visualizar Container Pré-Montado"
        closeBox={this.props.toggleWindow}>
        <div className="register-packs__information">
          <Input
            title="Série:"
            type="text"
            name="description"
            disabled={true}
            value={this.props.item.description}
          />
          <Input
            title="Modelo:"
            type="text"
            disabled={true}
            value={this.props.item.container.description}
          />
          <Input
            title="Pátio:"
            type="select"
            disabled={this.props.item.rented
              || !tools.isWriteAllowed('packs')}
            value={this.state.place._id}
            onChange={this.onChangePlace}>
            <option value=''>
              {this.props.item.rented ? "Alugado" : ""}
            </option>
              {this.renderPlaces()}
          </Input>
          <Input
            title="Observações:"
            type="text"
            className="register-packs__observations"
            name="observations"
            value={this.props.item.observations}
            onChange={this.onChange}
            disabled={!tools.isWriteAllowed('packs')}
          />
        </div>
        <ModulesList modules={this.props.item.modules}/>
        <FooterButtons
          disabled={!tools.isWriteAllowed('packs')}
          buttons={!this.props.item.rented ?
            [
              {text: "Desmontar Container",
              className: "button--danger",
              onClick: () => this.props.toggleConfirmationWindow(this.unmountPack, {
                message: `Deseja desmontar o container e retornar os componentes para o pátio ${this.state.place.description}?`
              })},
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
export default RegisterPacksWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch() || [];
  return {
    placesDatabase
  }
})(RegisterPacks);