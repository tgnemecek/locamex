import React from 'react';

export default class Select extends React.Component {
  render() {
    return (
      <select onChange={this.props.onChange}>
        {this.props.children}
      </select>
    )
  }
}