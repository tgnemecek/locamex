import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';

import tools from '/imports/startup/tools/index';

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
    this.setState({ return: e.target.value })
  }

  aaa = () => {
    var obj = {
      a: ['banana', 'apple']
    }

    var copy = {...obj};

    var a = obj.a;
    var b = copy.a;

    b.push('strawberry');

    console.log(a);

    // if (a === b) {
    //   return 'true'
    // } else return 'false';
  }

  render() {
    return (
      <div style={{width: "500px"}}>
        {this.aaa()}
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
