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

  handleInputChange = (e) => {
    const value =  e.target.value;
    this.setState({value});
  }

  render() {
    return (
      <Block columns={3} options={[{block: 3, span: 2}, {block: 1, span: 2}]}>
        <div style={{background: 'black'}}>
          <label>aaaaaaaaaaaaaaaaaaaaaaa</label>
        </div>
        <div style={{background: 'blue'}}>
          <label>aaaaaaaaaaaaaaaaaaaaaaa</label>
        </div>
        <div style={{background: 'black'}}>
          <label>aaaaaaaaaaaaaaaaaaaaaaa</label>
        </div>
        <div style={{background: 'blue'}}>
          <label>aaaaaaaaaaaaaaaaaaaaaaa</label>
        </div>
        <div style={{background: 'black'}}>
          <label>aaaaaaaaaaaaaaaaaaaaaaa</label>
        </div>
        <div style={{background: 'blue'}}>
          <label>aaaaaaaaaaaaaaaaaaaaaaa</label>
        </div>
      </Block>
    );
  }
}
