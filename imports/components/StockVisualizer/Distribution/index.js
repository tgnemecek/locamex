import React from 'react';
import Input from '/imports/components/Input/index';

export default class Distribution extends React.Component {
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

  render() {
    return (
      <div className="stock-visualizer__distribution">
        {this.props.places.map((item, i) => {
          return (
            <div key={i} className="stock-visualizer__place">
              <label>{item.description}</label>
              <Input
                type="number"
                min={0}
                max={999}
                value={item.available}
                name={i}
                onChange={this.onChangeAvailable}
                disabled={this.props.disabled}
                style={{color: "green",
                  textAlign: "right"}}
              />
              <Input
                type="number"
                min={0}
                max={999}
                value={item.inactive}
                name={i}
                onChange={this.onChangeInactive}
                disabled={this.props.disabled}
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