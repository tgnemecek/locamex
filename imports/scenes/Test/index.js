import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';

import tools from '/imports/startup/tools/index';

import SuggestionBar from '/imports/components/SuggestionBar/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  render() {
    return null;
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

