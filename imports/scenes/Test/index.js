import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Redirect } from 'react-router-dom';

import tools from '/imports/startup/tools/index';
import createExcel from '/imports/api/create-excel/index';
import Button from '/imports/components/Button/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    }
  }
  onClick = (e) => {
    var value = this.state.value + 1;
    this.setState({ value })
  }
  render() {
    return (
      <div>
        <Button onClick={this.onClick} icon="faPlusSquare">SET!!</Button>
        VALUE {this.state.value}
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