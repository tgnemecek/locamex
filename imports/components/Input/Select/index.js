import React from 'react';

export default class Select extends React.Component {
  onChange = (e) => {
    var obj = {
      target: {
        value: e.target.value,
        name: this.props.name,
        id: this.props.id
      }
    }
    this.props.onChange(obj);
  }
  render() {
    return (
      <select onChange={this.onChange}>
        {this.props.children}
      </select>
    )
  }
}