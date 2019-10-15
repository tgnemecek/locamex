import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Agenda } from '/imports/api/agenda/index';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }
  onClick = (e) => {
    Meteor.call('a', this.state.value, (err, res) => {
      console.log('RESPONDED!');
      this.setState({ value: res });
    });
  }
  render() {
    return (
      <div>
        <button onClick={this.onClick}>+2</button>
        <div>
          {this.state.value}
        </div>
        <div>
          Is it a Promise??
          {typeof this.state.value.then === "function" ? 'Yes!' : 'No!'}
        </div>
      </div>
    )
  }
}

export default TestWrap = withTracker((props) => {
  Meteor.subscribe('agendaPub');
  var agenda = Agenda.find().fetch();
  return {
    agenda
  }
})(TestPage);