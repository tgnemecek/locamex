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
      value: 0.1,
      otherValue: 0
    }
  }
  onChange = (e) => {
    alert('changed1');
    this.setState({
      value: e.target.value
    });
  }
  onChange2 = (e) => {
    alert('changed2!');

    var value = this.state.value;
    var otherValue = e.target.value;

    if (otherValue > 12) {
      value = 0.5
    }
    this.setState({
      value,
      otherValue
    });
  }
  render() {
    return (
      <div>
        <Input
          type="number"
          percent={true}
          onChange={this.onChange}
          value={this.state.value}
        />
        <Input
          type="number"
          onChange={this.onChange2}
          value={this.state.otherValue}
        />
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