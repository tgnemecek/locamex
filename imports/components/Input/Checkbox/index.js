import React from 'react';

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.id) throw new Error('No id provided to checkbox component!');
  }
  onChange = (e) => {
    if (e) {
      var value = e.target.checked;
      this.props.onChange(value);
    }
  }
  render() {
    return (
      <>
        <input
          type="checkbox"
          id={this.props.id}
          className="input--checkbox__box"
          checked={this.props.value}
          onChange={this.onChange}
          />
        <label htmlFor={this.props.id} className="input--checkbox__toggle"><span></span></label>
      </>
    )
  }
}