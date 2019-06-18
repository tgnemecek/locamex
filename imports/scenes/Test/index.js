import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Redirect } from 'react-router-dom';

import tools from '/imports/startup/tools/index';
import Button from '/imports/components/Button/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "loading"
    }
  }
  componentDidMount() {
// this.timeout();
  }

  timeout = () => {
    setTimeout(() => {
      this.setState({ status: "completed" });
    }, 5000);
  }

  onClick = () => {
    this.setState({ status: "failed" });
  }

  render() {
    return (
      <div>
        {this.state.status}
        <button onClick={this.onClick}>BOTAO</button>
        <DatabaseStatus status={this.state.status}/>
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