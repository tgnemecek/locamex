import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';
import { Clients } from '/imports/api/clients/index';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    }
  }

  onClick = () => {
    {//Transaction
      this.setState({ value: 999999 });
    }
  }


  render() {
    return (
      <>
        <button onClick={this.onClick}>{this.state.value}</button>
      </>

    )
  }
}
