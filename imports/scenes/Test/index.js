import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Redirect } from 'react-router-dom';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';



class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: ''
    }
  }

  onClick = () => {
    Meteor.call('agenda.insert', {
      insertionDate: new Date(),
      visibleTo: 'finances',
      type: 'test',
      date: new Date(),
      repeat: 'never'
    });
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.setFile}/>
        <button onClick={this.onClick}>BOTAO</button>
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