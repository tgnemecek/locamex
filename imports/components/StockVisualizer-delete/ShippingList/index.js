import React from 'react';
import Input from '/imports/components/Input/index';

export default class ShippingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false
    }
  }
  onDragOver = (e) => {
    e.preventDefault();
  }
  onDrop = (e) => {
    e.preventDefault();
    var placeId = e.dataTransfer.getData("placeId");

    var place = this.props.places.find((item) => {
      return item._id === placeId
    })

    var available = place.available;
    var renting = this.props.places.reduce((acc, cur) => {
      if (cur.renting) return acc + cur.renting;
    }, 0);

    var max = available < renting ? available : renting;

    if (this.props.item.type === 'accessory') {

    }

    this.setState({  })



    var available = Number(e.dataTransfer.getData("available"));
    var renting = this.props.item.renting;
    var max = available < renting ? available : renting;

    var selectedListQuantity = this.props.selectedList.reduce((acc, cur) => {
      return acc + cur.selected;
    }, 0)

    max = (renting - selectedListQuantity) < max ? (renting - selectedListQuantity) : max;

    this.setState({
      variationPlace,
      max,
      howManyBoxOpen: true,
      boxX: e.clientX,
      boxY: e.clientY
    })
  }
  render() {
    return (
      <div onDrop={this.onDrop} onDragOver={this.onDragOver}>
        aaaaaaa
        aaaaaaaa
        aaaaaaaaaa
      </div>
    )
  }
}