import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import tools from '/imports/startup/tools/index';

import { Places } from '/imports/api/places/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import PlacesDistribution from './PlacesDistribution/index';
import SelectedList from './SelectedList/index';

class SelectMultiple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: []
    }
  }

  addToSelection = (itemIndex, itemPlace, quantity) => {
    var item = this.props.item.variations[itemIndex];
    var selected = tools.deepCopy(this.state.selected);
    var alreadySelected = selected.findIndex((element) => {
      return element._id === itemIndex;
    })
    if (alreadySelected > -1) {
      selected[alreadySelected].quantity = selected[alreadySelected].quantity + quantity;
    } else {
      selected.push({
        _id: item._id,
        description: this.props.item.description,
        place: itemPlace,
        quantity
      });
      this.setState({ selected });
    }
  }

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
          <SelectedList selected={this.state.selected} addToSelection={this.addToSelection}/>
      </Box>
    )
  }
}

export default SelectMultipleWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  var placesDatabase = Places.find().fetch();
  return { placesDatabase };
})(SelectMultiple)