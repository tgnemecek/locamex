import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import PlacesDistribution from './PlacesDistribution/index';
import SelectedList from './SelectedList/index';
import SelectVariation from './SelectVariation/index';
import Footer from './Footer/index';

export default class SelectMultiple extends React.Component {
  constructor(props) {
    super(props);

    const populateVariations = () => {
      var variations = tools.deepCopy(this.props.productFromDatabase.variations);
      var selectedList = this.props.item.selectedList || [];
      if (!selectedList.length) return variations;

      selectedList.forEach((listItem) => {
        variations.forEach((variation) => {
          if (variation._id === listItem._id) {
            variation.place.forEach((place) => {
              if (place._id === listItem.place) {
                place.available = place.available - listItem.selected;
              }
            })
          }
        })
      })
      return variations;
    }

    this.state = {
      selectedList: this.props.item.selectedList || [],
      variations: populateVariations(),
      currentVariationIndex: 0
    }
  }

  addToSelection = (howManyToMove, variationPlace) => {

    var selectedList = tools.deepCopy(this.state.selectedList);
    var variationToAdd = this.state.variations[this.state.currentVariationIndex];
    var existingVariation = tools.findUsingId(selectedList, variationToAdd._id);

    if (existingVariation._id && existingVariation.place === variationPlace) {
      existingVariation.selected = existingVariation.selected + howManyToMove;
    } else {
      selectedList.push({
        _id: variationToAdd._id,
        place: variationPlace,
        selected: howManyToMove
      })
    }
    var variations = this.changeAvailable((0 - howManyToMove), variationToAdd._id, variationPlace);
    this.setState({ selectedList, variations });
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
              <div>
                {"Produto: " + this.props.productFromDatabase.description}
              </div>
              <SelectVariation
                onChange={this.changeVariationIndex}
                variations={this.state.variations}
                currentVariationIndex={this.state.currentVariationIndex}
              />
            </Block>
            <PlacesDistribution
              currentVariationIndex={this.state.currentVariationIndex}
              variations={this.state.variations}
              placesDatabase={this.props.placesDatabase}/>
          </Block>
          <SelectedList
            addToSelection={this.addToSelection}
            removeFromSelection={this.removeFromSelection}

            item={this.props.item}
            productFromDatabase={this.props.productFromDatabase}
            selectedList={this.state.selectedList}
            currentVariationId={this.state.variations[this.state.currentVariationIndex]._id}

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