import React from 'react';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';

export default class SelectVariation extends React.Component {

  onChange = (e) => {
    this.props.onChange(Number(e.target.value));
  }

  renderOptions = () => {
    return this.props.variations.map((variation, i, array) => {
      var label = array.length > 1 ? "Padrão " + tools.convertToLetter(i) : "Padrão Único";
      return <option key={i} value={i}>{label}</option>
    })
  }

  render() {
    return (
      <Input
        type="select"
        value={this.props.currentVariationIndex}
        onChange={this.onChange}
      >
        {this.renderOptions()}
      </Input>
    );
  }
}