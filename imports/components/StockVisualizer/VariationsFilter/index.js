import React from 'react';
import Input from '/imports/components/Input/index';

export default class VariationsFilter extends React.Component {

  getValue = () => {
    var index = this.props.variationIndex;
    var variation = this.props.variations[index];
    return variation._id
  }

  onChange = (e) => {
    var index = this.props.variations.findIndex((item) => {
      return item._id === e.target.value;
    });
    this.props.setVariationIndex(index);
  }

  renderObservations = () => {
    var index = this.props.variationIndex;
    var variation = this.props.variations[index];
    if (variation.observations) {
      return <div>{variation.observations}</div>
    } else return null;
  }

  render() {
    if (this.props.variations.length) {
      return (
        <div className="stock-visualizer__top">
          <Input
            type="select"
            onChange={this.onChange}
            value={this.getValue()}
            >
            {this.props.variations.map((variation, i) => {
              return (
                <option
                  key={i}
                  value={variation._id}>
                    {variation.description}
                </option>
              )
            })}
          </Input>
          {this.renderObservations()}
        </div>
      )
    } else return null;
  }
}