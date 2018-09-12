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
      // array: [
      //   "000   ",
      //   1,
      //   {name: "aaa     "},
      //   {name: "   bbb"},
      //   [
      //     {name1: "ccc    "},
      //     {name2: "    ddd"},
      //     {object: [
      //       [{name3: "eee   "}, {name4: "   fff"}],
      //       [{name5: "ggg   "}, {name6: "   hhh"}],
      //       {object2: {name7: "iii   "}}
      //     ]}
      //   ]
      // ]
      // array: [
      //   "000     ",
      //   {name: "111   "},
      //   "222      "
      // ]
      array: ["000   ", "111   "]
      // array: [{name: "000   "}]
    }
  }

  onClick = () => {
    var state = {...this.state};
    state = tools.trimStrings(state);
    console.log(state);
  }

  render() {
    return (
      <>
        <button onClick={this.onClick}>TRIM!!!!</button>
      </>

    )
  }
}
