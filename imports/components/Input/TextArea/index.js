import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class TextArea extends React.Component {
  constructor(props) {
    super(props);
    var style = this.props.style ? {...this.props.style, height: "5px"} : {height: "5px"};
    this.state = {
      style
    }
  }
  onKeyUp = (e) => {
    var node = e.currentTarget;
    var height = node.scrollHeight + "px";
    var style = this.props.style ? {...this.props.style, height} : {height};
    this.setState({ style });
  }
  onChange = (e) => {
    this.onKeyUp(e);
    if (e) {
      var value = e.target.value;
      this.props.onChange(value);
    }
  }
  render() {
    return (
      <textarea
        // onKeyUp={this.onKeyUp}
        value={this.props.value}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.state.style}/>
    )
  }
}