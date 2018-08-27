import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Text extends React.Component {
  onChange = (e) => {
    if (e) this.props.onChange(e.target.value);
  }
  render() {
    return (
      <input
        value={this.props.value}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}
        />
    )
  }
}