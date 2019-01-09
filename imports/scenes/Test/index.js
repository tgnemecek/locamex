import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';

import SuggestionBar from '/imports/components/SuggestionBar/index';

class TestPage extends React.Component {

  onClick = (e) => {
    console.log("_id: " + e.target.value);
  }

  render() {
    return (
      <SuggestionBar database={this.props.database} title="Pátio" onClick={this.onClick} />
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
