import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Agenda } from '/imports/api/agenda/index';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';
import Animation from '/imports/components/Animation/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }
  onChange = (e) => {
    this.setState({ value: e.target.value })
  }
  render() {
    return (
      <div>
        <Input
          type="phone"
          value={this.state.value}
          onChange={this.onChange}
        />
        Value: {tools.format(this.state.value, 'phone')}
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