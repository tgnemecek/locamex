import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Text extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
  }
  onChange = (e) => {
    if (e) {
      var value = e.target.value;
      this.props.onChange(value);
      this.setState({ value });
    }
  }
  render() {
    return (
      <input
        value={this.state.value}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}