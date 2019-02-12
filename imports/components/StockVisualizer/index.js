import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

import Fixed from './Fixed/index';

class StockVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item
    }
  }

  onChange = (item) => {
    this.setState({ item });
  }

  renderBody = () => {
    if (this.props.type === 'fixed') {
      return <Fixed {...this.props} item={this.state.item} onChange={this.onChange}/>
    } else return null;
  }
  saveEdits = () => {
    if (this.props.type === 'fixed') {
      Meteor.call('containers.fixed.update.one', this.state.item._id, this.state.item.units, 'units');
    } else return null;
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box
        title={`Visualizador de Estoque: ${this.state.item.description}`}
        closeBox={this.props.toggleWindow}
        width="800px">
        {this.renderBody()}
        <FooterButtons buttons={[
        {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
        {text: "Salvar", onClick: this.saveEdits}
        ]}/>
      </Box>
    )
  }
}

export default StockVisualizerWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  var ready = !!placesDatabase.length;
  return {
    placesDatabase,
    ready
  }
})(StockVisualizer);