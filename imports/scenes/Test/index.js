import React from 'react';
import { Meteor } from 'meteor/meteor';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Block from '/imports/components/Block/index';
import { Clients } from '/imports/api/clients';
import Test2 from './index2';
import Test3 from './index3';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    }
  }


  render() {
    return (
      <>
        <Block>
          <Test2/>
          <Test2/>
        </Block>
        <Test3>
          <Test2/>
          <Test2/>
        </Test3>
      </>
    )
  }
}
