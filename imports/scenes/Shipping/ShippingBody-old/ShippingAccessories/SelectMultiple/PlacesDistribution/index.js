import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class PlacesDistribution extends React.Component {
  getDescriptionPlace = (placeId) => {
    var place = this.props.placesDatabase.find((item) => {
      return item._id === placeId;
    });
    return place ? place.description : null;
  }

  renderBody = () => {
    return this.props.placesWithQuantity.map((place, i) => {
      const onDragStart = (e) => {
        e.dataTransfer.setData("variationPlace", place._id);
        e.dataTransfer.setData("available", place.available);
      }
      return (
        <div key={i} className="shipping__select-multiple__place" draggable={true} onDragStart={onDragStart}>
          <div>⧉</div>
          <div>{this.getDescriptionPlace(place._id)}</div>
          <div>{place.available}</div>
        </div>
      );
    })
  }

  render() {
    return (
      <Block columns={2} title="Estoque disponível do produto:">
        {this.renderBody()}
      </Block>
    )
  }
}