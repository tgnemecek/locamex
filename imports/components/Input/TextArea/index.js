import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }
  componentDidMount() {
    this.setHeight(this.ref.current);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setHeight(this.ref.current);
    }
  }
  setHeight = (node) => {
    if (!this.props.manualHeight) {
      node.style.height = "5px";
      node.style.height = (node.scrollHeight)+"px";
    }
  }
  onChange = (e) => {
    if (e) {
      var value = e.target.value;
      this.props.onChange(value);
    }
  }
  render() {
    return (
      <textarea
        ref={this.ref}

        value={this.props.value}
        onChange={this.onChange}

        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}

        style={this.props.style}/>
    )
  }
}