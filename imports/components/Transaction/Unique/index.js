import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

class Unique extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      place: this.props.item.place || '',
      status: this.props.item.status || 'available',
    }
  }

  renderPlaces = () => {
    return this.props.placesDatabase.map((place, i) => {
      return <option key={i} value={place._id}>{place.description}</option>
    })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  saveEdits = () => {
    var state = this.state;
    var type = this.props.item.type;
    state._id = this.props.item._id;

    if (type === "fixed") {
      Meteor.call('containers.transaction.fixed', state);
    } else if (type === "pack") {
      Meteor.call('packs.transaction', state);
    } else throw new Meteor.Error(`type-incorrect`, `type was not implemented: ${type}`);
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box
        title={"Movimentação: " + this.props.item.description}
        closeBox={this.props.toggleWindow}
        width="800px">
        <Block columns={2}>
          <Input
            title="Pátio:"
            type="select"
            name="place"
            value={this.state.place}
            onChange={this.onChange}>
              {this.renderPlaces()}
          </Input>
          <Input
            title="Status:"
            type="select"
            name="status"
            value={this.state.status}
            onChange={this.onChange}>
              <option value="available">Disponível</option>
              <option value="maintenance">Manutenção</option>
              <option value="inactive">Inativo</option>
              <option value="rented">Locado</option>
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

export default UniqueWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch({visible: true});
  var ready = !!placesDatabase.length;
  return {
    placesDatabase,
    ready
  }
})(Unique)