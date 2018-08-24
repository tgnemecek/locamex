import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';
import { Clients } from '/imports/api/clients';

export default class Test2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [1, 2, 3, 4],
      value: 10
    }
  }

  renderRows = () => {
    return this.state.arr.map((a, i) => {
      return <p key={i} onClick={this.onClick}>{this.state.value}</p>
    })
  }

  onClick = (e) => {
    var arr = tools.deepCopy(this.state.arr);
    arr.push(1);
    this.setState({arr});
  }

  render() {
    return (
      <div>
        <p>HERE!!!</p>
        {this.renderRows()}
      </div>
    )
  }
}
