import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import CustomInput from '/imports/components/CustomInput/index';
import { Clients } from '/imports/api/clients';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
    };
  }

  componentDidMount() {
    this.contractsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var value = Clients.find("0001").fetch();
      this.setState({ value });
    })
  }

  render() {
    return (
      <div>
        {this.state.value.map((a) => a.clientName)}
      </div>
    )
  }
}
