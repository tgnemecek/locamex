import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Redirect } from 'react-router-dom';

import tools from '/imports/startup/tools/index';

import SuggestionBar from '/imports/components/SuggestionBar/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    }
  }
  onChange = (e) => {
    this.setState({ value: e.target.value })
  }
  onClick = (e) => {
    this.setState({ value: 999 })
  }
  render() {
    return (
      <div>
        <Input
          title="Teste"
          name="value"
          type="currency"
          onChange={this.onChange}
          value={this.state.value}
        />
        {/* <Test value={this.state.value} onChange={this.onChange}/> */}
        {/* VALUE: {this.state.value} */}
        <button onClick={this.onClick}>SET</button>
      </div>

    )
  }
}

var count = 0;

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInput: false
    }
  }
  componentDidUpdate(prevProps, prevState) {
    count++;
    if (this.state.isInput) {
      console.table("UPDATED!", count, prevProps.value, prevState.isInput, this.props.value, this.state.isInput);
      this.setState({ isInput: false })
    }
  }
  onChange = (e) => {
    var value = e.target.value;
    this.setState({ isInput: true }, () => {
      this.props.onChange({target: {value}});
    })
  }
  render() {
    return (
      <input
        value={this.props.value}
        onChange={this.onChange}
      />
    )
  }
}

export default TestWrap = withTracker((props) => {
  Meteor.subscribe('containersPub');
  var database = Containers.find().fetch();
  var ready = !!database.length;
  return {
    database,
    ready
  }
})(TestPage);