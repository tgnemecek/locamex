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
  onClick = (e) => {
    Meteor.call('pdf.generate', (err, res) => {
      if (err) {
        if (err.error) {
          alert(err.error)
        } else alert(err);
      }
      if (res) {
        alert('done! value: ' + res);
      }
    })
  }
  render() {
    return (
      <div>
        <button onClick={this.onClick}>GERAR!</button>
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