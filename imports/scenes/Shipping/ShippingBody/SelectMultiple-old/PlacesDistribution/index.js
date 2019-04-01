import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default function PlacesDistributionWrapper(props) {
  var placesWithQuantity = [];

  if (props.variations) {
    placesWithQuantity = props.variations[props.currentVariationIndex].place.filter((place) => {
      return place.available > 0;
    })
  } else {
    placesWithQuantity = props.item.place.filter((place) => {
      return place.available > 0;
    })
  }
  return (
    <PlacesDistribution
      placesDatabase={props.placesDatabase}
      placesWithQuantity={placesWithQuantity}
    />
  )
}

class PlacesDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovering: false
    }
  }
  getDescriptionPlace = (placeId) => {
    var place = this.props.placesDatabase.find((item) => {
      return item._id === placeId;
    });
    return place ? place.description : null;
  }

  style = () => {
    if (this.state.hovering) return {cursor: "grab"}
    return {}
  }

  hoveringState = () => {
    this.setState({ hovering: true })
  }

  normalState = () => {
    this.setState({ hovering: false })
  }

  renderBody = () => {
    return this.props.placesWithQuantity.map((place, i) => {
      const onDragStart = (e) => {
        e.dataTransfer.setData("place", place._id);
        e.dataTransfer.setData("available", place.available);
      }
      return (
        <div key={i}
          className="shipping-accessories__select-multiple__place"
          style={this.style()}
          onMouseOver={this.hoveringState}
          onMouseOut={this.normalState}
          draggable={true}
          onDragStart={onDragStart}
          >
          <div>⧉</div>
          <div>{this.getDescriptionPlace(place._id)}</div>
          <div>{place.available}</div>
        </div>
      );
    })
  }

  render() {
    if (this.props.placesWithQuantity.length) {
      return (
        <Block columns={2} title="Estoque disponível do produto:">
          {this.renderBody()}
        </Block>
      )
    } else return (
      <Block columns={2} title="Não há quantidade disponível do produto em estoque!"></Block>
    )
  }
}