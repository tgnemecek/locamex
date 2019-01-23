import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';

import SuggestionBar from '/imports/components/SuggestionBar/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      return: ''
    }
  }

  onChange = (e) => {
    var value = e.target.value;

    value = Number(value);


    this.setState({ return: value })
  }

  render() {
    return (
      <div style={{width: "50px"}}>
        <input onChange={this.onChange} type="text"/>
        Return is: {this.state.return}
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
