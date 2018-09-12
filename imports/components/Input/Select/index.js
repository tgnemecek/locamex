import React from 'react';

export default class Select extends React.Component {
  onChange = (e) => {
    if (e) {
      var value = e.target.value;
      this.props.onChange(value);
    }
  }
  render() {
    return (
      <select value={this.props.value} onChange={this.onChange} disabled={this.props.disabled}>
        {this.props.children}
      </select>
    )
  }
}