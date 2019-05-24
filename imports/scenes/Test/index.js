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
      negative: 10,
      positive: 6
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  onClick = (e) => {
    this.setState({ positive: 500.2 })
  }
  render() {
    return (
      <div>
        {/* <Input
          title="Negative"
          name="negative"
          type="number"
          onChange={this.onChange}
          value={this.state.negative}
          allowFloat={false}
        />
        VALUE: {this.state.negative} */}
        <Input
          title="Positive"
          name="positive"
          allowFloat={false}
          type="number"
          min={5}
          max={10}
          onChange={this.onChange}
          value={this.state.positive}
        />
        VALUE: {this.state.positive}
        <button onClick={this.onClick}>SET</button>
      </div>

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