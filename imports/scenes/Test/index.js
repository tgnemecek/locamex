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
      mounted: true
    }
  }
  onClick = () => {
    this.setState({ mounted: !this.state.mounted })
  }
  render() {
    return (
      <div>
        <Animation
          mounted={this.state.mounted}
          tag="div"
          fadeIn={{duration: 5000, offset: 0}}
          // fadeOut={2000}
          >
          <div style={{
            height: "300px",
            width: "300px",
            background: "blue"
          }}>
            CONTENT
          </div>
        </Animation>
        <button onClick={this.onClick}>DESTROY</button>
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