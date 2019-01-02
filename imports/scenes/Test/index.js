import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Test, Test2 } from '/imports/api/test/index';

class TestPage extends React.Component {
  renderLines = () => {
    return this.props.database.map((person, i) => {
      return <div key={i}><p>{person.name}</p></div>
    })
  }
  render() {
    return <div>{this.props.ready ? this.renderLines() : null}</div>
  }
}

export default TestWrap = withTracker((props) => {
  Meteor.subscribe('testPub');
  var database = Test.find().fetch().concat(Test2.find().fetch());
  var ready = !!database.length;
  return {
    database,
    ready
  }
})(TestPage);
