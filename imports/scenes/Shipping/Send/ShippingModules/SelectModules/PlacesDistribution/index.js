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
    var places = [...this.props.item.place];

    // Deducts quantities that are already on the list
    this.props.selectedList.forEach((item) => {
      places.forEach((place) => {
        if (place._id === item.place) {
          place.available = place.available - item.selected;
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
          e.dataTransfer.setData("place", place._id);
          e.dataTransfer.setData("available", place.available);
        }
        return (
          <div key={i}
            className="shipping__select-multiple__place"
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
    } else return <p>Não há quantidade disponível do produto em estoque!</p>;
  }

  render() {
    return (
      <Block columns={2} title="Estoque do produto:">
        {this.renderBody()}
      </Block>
    )
  }
}