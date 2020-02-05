import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import PlacesDistribution from './PlacesDistribution/index';
import SelectedList from './SelectedList/index';
import Footer from './Footer/index';

export default class SelectModules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: this.props.item.selected || []
    }
  }

  addToSelection = (howManyToMove, place) => {
    var selectedList = [...this.state.selectedList];
    var existing = selectedList.find((item) => item.place === place);

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

  removeFromSelection = (selectedToRemoveIndex, place) => {
    var selectedList = [...this.state.selectedList];
    var quantity = selectedList[selectedToRemoveIndex].selected;
    selectedList.splice(selectedToRemoveIndex, 1);

    this.setState({ selectedList });
  }

  changeAvailable = (toChange, variationId, placeId) => {
    var variations = [...this.state.variations];
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

  saveEdits = () => {
    this.props.setSelected(
      this.props.item._id, this.state.selectedList
    );
    this.props.toggleWindow();
  }

  render() {
    return (
      <Box
        title="Selecionar Quantidades"
        className="shipping__select__select-modules"
        closeBox={this.props.toggleWindow}
        >
          <div>
            <div>{"Produto: " + this.props.item.description}</div>
            <PlacesDistribution
              productFromDatabase={this.props.productFromDatabase}
              selectedList={this.state.selectedList}
              placesDatabase={this.props.placesDatabase}/>
          </div>
          <SelectedList
            addToSelection={this.addToSelection}
            removeFromSelection={this.removeFromSelection}

            item={this.props.item}
            productFromDatabase={this.props.productFromDatabase}
            selectedList={this.state.selectedList}

            placesDatabase={this.props.placesDatabase}
          />
          <Footer
            toggleWindow={this.props.toggleWindow}
            saveEdits={this.saveEdits}
          />
      </Box>
    )
  }
}