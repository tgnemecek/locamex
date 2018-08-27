import React from 'react';

export default class Select extends React.Component {
  constructor(props) {
    super(props);
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
      <select value={this.state.value} onChange={this.onChange}>
        {this.props.children}
      </select>
    )
  }
}