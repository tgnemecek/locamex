import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import moment from 'moment';
import Input from '/imports/components/Input/index';

export default class VariationsVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variationIndex: 0
    }
  }
  getVariation = () => {
    var index = this.state.variationIndex;
    return this.props.variations[index] || {};
  }
  changeVariationIndex = (e) => {
    this.setState({
      variationIndex: e.target.value
    })
  }
  render() {
    return (
      <div>
        <div className="image-visualizer__date">
          <div className="image-visualizer__top">
            <Input
              type="select"
              value={this.state.variationIndex}
              onChange={this.changeVariationIndex}
              >
                {this.props.variations.map((variation, i) => {
                  return (
                    <option key={i} value={i}>
                      {variation.description}
                    </option>
                  )
                })}
            </Input>
            {this.getVariation().observations}
          </div>
        </div>
        {this.getVariation().image ?
          <img src={this.getVariation().image + "?" + new Date().getTime()}/>
        : <p>Nenhuma imagem disponível</p>}
      </div>
    )
  }
}