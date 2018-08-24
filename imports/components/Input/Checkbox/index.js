import React from 'react';

export default class Checkbox extends React.Component {
  render() {
    return <input type="checkbox" checked={this.props.value} onChange={this.props.onChange}/>
  }
}