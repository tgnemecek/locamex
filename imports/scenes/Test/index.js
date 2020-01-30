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
      value: 0,
      otherValue: 0
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ value: 100 });
    }, 2000);
  }
  onChange = (e) => {
    this.setState({ value: e.target.value, otherValue: 999 });
  }
  render() {
    return (
      <div>
        <input
          onChange={this.onChange}
          value={this.state.value}
        />
        <input value={this.state.otherValue}/>
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