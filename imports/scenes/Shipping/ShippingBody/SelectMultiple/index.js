import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import PlacesDistribution from './PlacesDistribution/index';
import SelectedList from './SelectedList/index';

export default class SelectMultiple extends React.Component {
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
          <Block columns={1} title={"Produto: " + tools.findUsingId(this.props.accessoriesDatabase, this.props.item._id).description}>
            <PlacesDistribution
              item={this.props.item}
              accessoriesDatabase={this.props.accessoriesDatabase}
              placesDatabase={this.props.placesDatabase}/>
          </Block>
          <SelectedList selected={this.state.selected} addToSelection={this.addToSelection}/>
      </Box>
    )
  }
}