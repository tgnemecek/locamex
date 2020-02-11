import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class PlacesDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovering: false
    }
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
    var places = tools.deepCopy(this.props.places);

    // Deducts quantities that are already on the list
    this.props.from.forEach((item) => {
      places.forEach((place) => {
        if (place._id === item._id) {
          place.available = place.available - item.renting;
        }
      })
    });

    // Filters available = 0

    var placesWithQuantity = places.filter((item) => {
      return item.available > 0;
    })

    // Renders

    if (placesWithQuantity.length) {
      return placesWithQuantity.map((place, i) => {
        const onDragStart = (e) => {
          e.dataTransfer.setData("placeId", place._id);
          e.dataTransfer.setData("available", place.available);
        }
        return (
          <div key={i}
            className="shipping__select__place-strip"
            style={this.style()}
            onMouseOver={this.hoveringState}
            onMouseOut={this.normalState}
            draggable={true}
            onDragStart={onDragStart}
            >
            <div>⧉</div>
            <div>{place.description}</div>
            <div>{place.available}</div>
          </div>
        );
      })
    } else return <p>Não há quantidade disponível do produto em estoque!</p>;
  }

  render() {
    return (
      <>
        <h4>Estoque do produto:</h4>
        <div
          className="shipping__select__places-distribution">
          {this.renderBody()}
        </div>
      </>
    )
  }
}