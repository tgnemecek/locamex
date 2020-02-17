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

  filterPlaces = () => {
    var originalPlaces = tools.deepCopy(this.props.originalPlaces);
    this.props.currentPlaces.forEach((item) => {
      originalPlaces.forEach((place) => {
        if (place._id === item._id) {
          place.available = place.available - item.quantity;
        }
      })
    });
    return originalPlaces.filter((item) => {
      return item.available > 0;
    })
  }

  renderBody = () => {
    var placesWithQuantity = this.filterPlaces();
    if (placesWithQuantity.length) {
      return placesWithQuantity.map((place, i) => {
        const onDragStart = (e) => {
          e.dataTransfer.setData("placeId", place._id);
          e.dataTransfer.setData("available", place.available);
        }
        return (
          <div key={i}
            className="stock-transition__place-strip"
            style={this.style()}
            onMouseOver={this.hoveringState}
            onMouseOut={this.normalState}
            draggable={true}
            onDragStart={onDragStart}
            >
            <div>⧉</div>
            <label
              style={this.style()}
              draggable={true}
              onMouseOver={this.hoveringState}
              onMouseOut={this.normalState}>
                {place.description}
            </label>
            <div>{place.available}</div>
          </div>
        );
      })
    } else return null;
  }

  render() {
    if (this.filterPlaces().length) {
      return (
        <div
          className="stock-transition__places">
          {this.renderBody()}
        </div>
      )
    } else return (
      <p>Não há quantidade disponível do produto em estoque!</p>
    )
  }
}