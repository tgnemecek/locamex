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
  render() {
    return (
      <Box
        title="Visualizador de Estoque"
        closeBox={this.props.toggleWindow}
        width="800px">
        {this.renderBody()}
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