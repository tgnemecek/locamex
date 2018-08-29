import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';
import { Clients } from '/imports/api/clients';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    }
  }

  onClick = () => {
    this.setState({value: 20});
  }


  render() {
    var Rend = this.state.value == 10 ? Block : <div>AAAA</div>
    return (
      <>
        <Rend/>
        <button onClick={this.onClick}>click</button>
      </>

    )
  }
}
