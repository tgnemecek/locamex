import React from 'react';
import Input from '/imports/components/Input/index';

export default class Distribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovering: false
    }
  }
  onChangeAvailable = (e) => {
    var places = [...this.props.places];
    var index = e.target.name;
    places[index].available = e.target.value;
    this.props.updateItem(places);
  }

  onChangeInactive = (e) => {
    var places = [...this.props.places];
    var index = e.target.name;
    places[index].inactive = e.target.value;
    this.props.updateItem(places);
  }

  style = () => {
    if (this.state.hovering && this.props.isShipping) {
      return {cursor: "grab"}
    } else return {};
  }

  render() {
    return (
      <div className="stock-visualizer__distribution">
        {this.props.places.map((item, i) => {
          const onDragStart = (e) => {
            if (this.props.isShipping) {
              e.dataTransfer.setData("placeId", item._id);
            }
          }
          return (
            <div
              key={i}
              style={this.style()}
              onMouseOver={() => this.setState({hovering: true})}
              onMouseOut={() => this.setState({hovering: false})}
              draggable={!!this.props.isShipping}
              onDragStart={onDragStart}
              className="stock-visualizer__place">
              <label style={this.style()}>
                {item.description}
              </label>
              <Input
                type="number"
                min={0}
                max={999}
                disabled={this.props.isShipping}
                value={item.available}
                name={i}
                onChange={this.onChangeAvailable}
                style={{color: "green",
                  textAlign: "right"}}
              />
              <Input
                type="number"
                min={0}
                max={999}
                disabled={this.props.isShipping}
                value={item.inactive}
                name={i}
                onChange={this.onChangeInactive}
                style={{color: "red",
                  textAlign: "right"}}
              />
            </div>
          )
        })}
      </div>
    )
  }
}