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
      a: "Alo, como vai? Qual é o seu nome? Prazer em conhecer."
    }
  }

  onChange = (e) => {
    console.log(e.target.value);
  }

  render() {
    return (
      <div style={{width: "50px"}}>
        <Input
          type="textarea"
          value={this.state.a}
          onChange={this.onChange}
        />
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
