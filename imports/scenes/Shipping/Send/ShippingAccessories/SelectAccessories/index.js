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

export default class SelectAccessories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedList: this.props.item.selected || [],
      currentVariationIndex: 0
    }
  }

  addToSelection = (howManyToMove, variationPlace) => {

    var selectedList = tools.deepCopy(this.state.selectedList);
    var variationToAdd = this.props.productFromDatabase.variations[this.state.currentVariationIndex];
    var existingVariation = tools.findUsingId(selectedList, variationToAdd._id);

    if (existingVariation._id && existingVariation.place === variationPlace) {
      existingVariation.selected = existingVariation.selected + howManyToMove;
    } else {
      selectedList.push({
        _id: variationToAdd._id,
        place: variationPlace,
        selected: howManyToMove,
        variationIndex: this.state.currentVariationIndex
      })
    }
    this.setState({ selectedList });
  }

  removeFromSelection = (selectedToRemoveIndex, place) => {
    var selectedList = tools.deepCopy(this.state.selectedList);
    var quantity = selectedList[selectedToRemoveIndex].selected;
    selectedList.splice(selectedToRemoveIndex, 1);

    this.setState({ selectedList });
  }

  changeVariationIndex = (currentVariationIndex) => {
    this.setState({ currentVariationIndex });
  }

  saveEdits = () => {
    this.props.onChange({
      _id: this.props.item._id,
      selected: this.state.selectedList
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
                currentVariationIndex={this.state.currentVariationIndex}
                variations={this.props.productFromDatabase.variations}
              />
            </Block>
            <PlacesDistribution
              item={this.props.item}
              productFromDatabase={this.props.productFromDatabase}
              currentVariationIndex={this.state.currentVariationIndex}
              selectedList={this.state.selectedList}
              placesDatabase={this.props.placesDatabase}
            />
          </Block>
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