import React from 'react';

import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import PlacesDistribution from './PlacesDistribution/index';
import SelectedList from './SelectedList/index';
import Footer from './Footer/index';

export default class StockTransition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: tools.deepCopy(this.props.item.places) || []
    }
  }

  addToSelection = (howManyToMove, placeId) => {
    var places = [...this.state.places];

    var place = this.props.places.find((item) => {
      return item._id === placeId;
    })
    var exists = places.find((item) => {
      return item._id === placeId;
    })
    if (exists) {
      exists.quantity += howManyToMove;
    } else {
      places.push({
        _id: place._id,
        description: place.description,
        quantity: howManyToMove
      })
    }
    this.setState({ places });
  }

  removeFromSelection = (index, place) => {
    var places = [...this.state.places];
    places.splice(index, 1);

    this.setState({ places });
  }

  saveEdits = () => {
    this.props.update(this.state.places,
      this.props.toggleWindow);
  }

  render() {
    return (
      <Box
        title="Selecionar Quantidades"
        className="stock-transition"
        closeBox={this.props.toggleWindow}
        >
          <h4>
            {this.props.title}
          </h4>
          <PlacesDistribution
            item={this.props.item}
            originalPlaces={this.props.places}
            currentPlaces={this.state.places}
          />
          <SelectedList
            addToSelection={this.addToSelection}
            removeFromSelection={this.removeFromSelection}
            title={this.props.title}
            parentDescription={this.props.parentDescription}
            item={this.props.item}
            currentPlaces={this.state.places}
            max={this.props.max}
          />
          <Footer
            toggleWindow={this.props.toggleWindow}
            saveEdits={this.saveEdits}
          />
      </Box>
    )
  }
}