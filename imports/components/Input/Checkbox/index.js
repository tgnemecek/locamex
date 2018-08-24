import React from 'react';

export default class Checkbox extends React.Component {
  render() {
    return (
      <label className="input--checkbox__toggle">
        <span></span>
        <input
          type="checkbox"
          className="input--checkbox__box"
          checked={this.props.value}
          onChange={this.props.onChange}/>
      </label>
    )
  }
}