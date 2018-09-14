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
      str1: 'aaaa',
      str2: 'AAAA',
      str3: 'aAaA',
      str4: 'aaaa bBbB',
      str5: 'aaaa (aaaa) /aaaa 1aaaa ,aaaa .aaaa'
    }
  }

  onClick = () => {
    var state = {...this.state};
    Object.keys(state).forEach((key) => {
      state[key] = capitalizeFirstLetter(state[key]);
    })
    this.setState(state);
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  render() {
    return (
      <>
      {this.state.str1}<br/>
      {this.state.str2}<br/>
      {this.state.str3}<br/>
      {this.state.str4}<br/>
      {this.state.str5}<br/>
        <button onClick={this.onClick}>capitalize!!!!</button>
      </>

    )
  }
}
