import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class PlacesDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variationIndex: 0
    }
  }

  getDescriptionPlace = (placeId) => {
    var place = this.props.placesDatabase.find((item) => {
      return item._id === placeId;
    });
    return place ? place.description : null;
  }

  renderBody = () => {
    var variation = this.props.item.variations[this.state.variationIndex];
    var places = variation.place.filter((place) => {
      return place.available > 0;
    })
    return places.map((place, i) => {
      const onDragStart = (e) => {
        e.dataTransfer.setData("itemIndex", i);
        e.dataTransfer.setData("itemPlace", place._id);
      }
      return (
        <div key={i} className="shipping-accessories__select-multiple__place" draggable={true} onDragStart={onDragStart}>
          <div>⧉</div>
          <div>{this.getDescriptionPlace(place._id)}</div>
          <div>{place.available}</div>
        </div>
      );
    })
  }

  render() {
    return (
      <Block columns={2}>
        {this.renderBody()}
      </Block>
    )
  }
}