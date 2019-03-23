import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import PlacesDistribution from './PlacesDistribution/index';
import SelectedList from './SelectedList/index';
import SelectVariation from './SelectVariation/index';

export default class SelectMultiple extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      allVariations: this.props.productFromDatabase.variations, //   TEM UM VALOR PRA UMA VARIACAO E OUTRO PRA TODAS???????
      variation: this.props.productFromDatabase.variations[0]._id //  ...TA ERRADO ISSO, TEM QUE TIRAR
    }
  }

  addToSelection = (howManyToMove, variationPlace) => {  // AO ADICIONAR, TEM QUE REDUZIR A QTD QUE TEM NA VARIACAO
    var selected = tools.deepCopy(this.state.selected);
    var existingVariation = tools.findUsingId(selected, this.state.variation);

    if (existingVariation._id && existingVariation.place === variationPlace) {
      existingVariation.selected = existingVariation.selected + howManyToMove;
    } else {
      var variationFromDatabase = tools.findUsingId(this.props.productFromDatabase.variations, this.state.variation);
      selected.push({
        _id: variationFromDatabase._id,
        place: variationPlace,
        selected: howManyToMove
      })
      this.setState({ selected });
    }
  }

  removeFromSelection = (selectedToRemoveId) => { // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CONTINUAR AQUI, QUANTIDADES TEM QUE VOLTAR
    var selected = this.state.selection.filter((item) => {
      return item._id !== selectedToRemoveId;
    })
    var selectedToRemoveObj = tools.findUsingId(this.state.selection, selectedToRemoveId);
    var restorePlace = selectedToRemoveObj.place;
    var restoreQuantity = selectedToRemoveObj.selected;

    this.setState({ selected })
  }

  changeVariation = (variation) => {
    this.setState({ variation });
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
                onChange={this.changeVariation}
                productFromDatabase={this.props.productFromDatabase}
                variation={this.state.variation}
              />
            </Block>
            <PlacesDistribution
              item={this.props.item}
              variation={this.state.variation}
              productFromDatabase={this.props.productFromDatabase}
              placesDatabase={this.props.placesDatabase}/>
          </Block>
          <SelectedList
            selected={this.state.selected}
            addToSelection={this.addToSelection}
            removeFromSelection={this.removeFromSelection}
            variation={this.state.variation}
            item={this.props.item}
            placesDatabase={this.props.placesDatabase}
          />
      </Box>
    )
  }
}