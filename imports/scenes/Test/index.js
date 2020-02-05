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
  render() {
    return (
      <div>
        {this.props.data.length ?
          this.props.data[0].description + "_" +
          this.props.data[0].productId
        : null}
      </div>
    )
  }
}

export default TestWrap = withTracker((props) => {
  Meteor.subscribe('testPub');
  var data = Test.find().fetch();
  return {
    data
  }
})(TestPage);