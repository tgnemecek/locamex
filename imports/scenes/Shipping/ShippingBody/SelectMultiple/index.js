import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import tools from '/imports/startup/tools/index';

import { Places } from '/imports/api/places/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import PlacesDistribution from './PlacesDistribution/index';

class SelectMultiple extends React.Component {
  render() {
    return (
      <Box
        title="Selecionar Quantidades"
        width="800px"
        closeBox={this.props.toggleWindow}
        >
          <Block columns={1} title={"Produto: " + this.props.item.description}>
            <PlacesDistribution {...this.props} />
          </Block>
      </Box>
    )
  }
}

export default SelectMultipleWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  return { placesDatabase };
})(SelectMultiple)