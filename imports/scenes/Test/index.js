import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Test } from '/imports/api/test/index';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  onClick = () => {
    Meteor.call('users.test')
  }
  render() {
    return (
      <div>
        {this.props.array.map((item) => {
          return item.places.map((item1) => {
            return (
              <p>{item1}</p>
            )
          })
        })}
      </div>
    )
  }
}

export default TestWrap = withTracker((props) => {
  // Meteor.subscribe('testPub');
  // var data = Test.find().fetch();
  return {
    array: [{places: ["a", "b"]}, {places: ["c", "d"]}]
  }
})(TestPage);