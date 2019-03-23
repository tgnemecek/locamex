import React from 'react';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';

export default class SelectVariation extends React.Component {

  onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  renderOptions = () => {
    return this.props.productFromDatabase.variations.map((variation, i) => {
      return <option key={i} value={variation._id}>{i+1}</option>
    })
  }

  render() {
    return (
      <Input
        type="select"
        value={this.props.variation}
        onChange={this.onChange}
      >
        {this.renderOptions()}
      </Input>
    );
  }
}