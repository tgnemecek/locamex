import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class WithoutVariations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: this.props.item.selectedList || []
    }
  }

  addToSelection = (howManyToMove, place) => {
    var selectedList = tools.deepCopy(this.state.selectedList);
    var existing = selectedList.find((item) => item.place === place._id);

    if (existing) {
      existing.selected = existing.selected + howManyToMove;
    } else {
      selectedList.push({
        place,
        selected: howManyToMove
      })
    }
    this.setState({ selectedList });
  }

  removeFromSelection = (selectedToRemoveIndex) => {
    var selectedList = this.state.selectedList
    var itemRemoved = selectedList[selectedToRemoveIndex];

    selectedList = selectedList.filter((item) => {
      if (item._id !== itemRemoved._id) {
        return true;
      } else {
        if (item.place === itemRemoved.place) {
          return false;
        } else return true;
      }
    })
    var variations = this.changeAvailable(itemRemoved.selected, itemRemoved._id, itemRemoved.place)
    this.setState({ selectedList, variations });
  }

  changeAvailable = (toChange, variationId, placeId) => {
    var variations = tools.deepCopy(this.state.variations);
    var variationToChangeIndex = variations.findIndex((item) => {
      return item._id === variationId;
    })
    var placeToChangeIndex = variations[variationToChangeIndex].place.findIndex((item) => {
      return item._id === placeId;
    })
    var placeToChange = variations[variationToChangeIndex].place[placeToChangeIndex];
    var previousRemaining = placeToChange.available;
    var newRemaining = previousRemaining + toChange;
    if (newRemaining < 0) throw new Meteor.Error('number-cannot-be-negative!');
    variations[variationToChangeIndex].place[placeToChangeIndex].available = newRemaining;
    return variations;
  }

  changeVariationIndex = (currentVariationIndex) => {
    this.setState({ currentVariationIndex });
  }

  saveEdits = () => {
    this.props.onChange({
      _id: this.props.productFromDatabase._id,
      selectedList: this.state.selectedList
    });
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box
        title="Selecionar Quantidades"
        width="800px"
        closeBox={this.props.toggleWindow}
        >
          <Block columns={1}>
            <Block columns={2}>
              <div>{this.props.title}</div>
            </Block>
            <this.props.PlacesDistribution
              item={this.props.item}
              placesDatabase={this.props.placesDatabase}/>
          </Block>
          <this.props.SelectedList
            addToSelection={this.addToSelection}
            removeFromSelection={this.removeFromSelection}

            item={this.props.item}
            productFromDatabase={this.props.productFromDatabase}
            selectedList={this.state.selectedList}

            placesDatabase={this.props.placesDatabase}
          />
          <this.props.Footer
            toggleWindow={this.props.toggleWindow}
            saveEdits={this.saveEdits}
          />
      </Box>
    )
  }
}