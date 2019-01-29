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

  render() {
    return (
      <div style={{width: "500px"}}>
        <Input
          type="currency"
          onChange={this.onChange}
          value={this.state.return}
          allowNegative={true}
        />
        {/* <input onChange={this.onChange} type="text"/>
        Return is: {this.state.return}
        aaaaaaaaa {tools.format("-", "currency")} */}
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
