import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class Text extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayValue: this.props.value,
      exportValue: this.props.value,
      style: {}
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        displayValue: this.props.value,
        exportValue: this.props.value
       });
    }
  }

  onChange = (e) => {
    if (e) {
      var e = {
        target: {
          value: exportValue,
          name: this.props.name,
          id: this.props.id
        }
      }
      this.props.onChange(e);
    }
  }

  render() {
    return (
      <input
        value={this.state.displayValue}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.state.style}
        />
    )
  }
}