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
      from: tools.deepCopy(this.props.item.from) || []
    }
  }

  addToSelection = (howManyToMove, placeId) => {
    var from = [...this.state.from];

    var place = this.props.places.find((item) => {
      return item._id === placeId;
    })
    var exists = from.find((item) => {
      return item._id === placeId;
    })
    if (exists) {
      exists.renting += howManyToMove;
    } else {
      from.push({
        _id: place._id,
        description: place.description,
        renting: howManyToMove
      })
    }
    this.setState({ from });
  }

  removeFromSelection = (index, place) => {
    var from = [...this.state.from];
    from.splice(index, 1);

    this.setState({ from });
  }

  saveEdits = () => {
    this.props.update(this.state.from,
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
            places={this.props.places}
            from={this.state.from}
          />
          <SelectedList
            addToSelection={this.addToSelection}
            removeFromSelection={this.removeFromSelection}
            title={this.props.title}
            parentDescription={this.props.parentDescription}
            item={this.props.item}
            from={this.state.from}
            places={this.props.places}
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