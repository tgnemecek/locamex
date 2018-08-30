import React from 'react';

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.id) throw new Error('No id provided to checkbox component!');
    this.state = {
      value: this.props.value
    }
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
      <>
        <input
          type="checkbox"
          id={this.props.id}
          className="input--checkbox__box "
          checked={this.state.value}
          onChange={this.onChange}
          />
        <label htmlFor={this.props.id} className="input--checkbox__toggle"><span></span></label>
      </>
    )
  }
}