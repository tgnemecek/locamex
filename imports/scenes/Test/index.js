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

import generateTable from '/imports/helpers/Pdf/generate-table/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
    var body = [
      [
        '1',
        '2',
        '3'
      ],
      [
        {text: 'a', colSpan: 'fill'},
        'b'
      ],
      [
        {text: 'x', colSpan: 2},
        {text: 'y'}
      ],
      [
        {text: 'I', colSpan: 2},
        {text: 'II', colSpan: 2}
      ]
    ]
    var widths = ['auto', 'auto', 'auto', 'auto'];

    this.data = {
      body,
      widths
    }
  }
  onClick = (e) => {
    generateTable(this.data);
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