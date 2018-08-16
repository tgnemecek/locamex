import React from 'react';
import { Meteor } from 'meteor/meteor';
import customTypes from '/imports/startup/custom-types';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [
        {name: 'aaa', _id: '01'},
        {name: 'bbb', _id: '02'},
        {name: 'ccc', _id: '03'}

      ]
    };
  }

  componentDidMount() {
    var a = customTypes.deepCopy(this.state.array);
    a[0].name = 'yooooooooooo';
    console.log(a);
    this.forceUpdate();
  }

  renderArray = () => {
    return this.state.array.map((item, i) => {
      return (
        <div key={i}>
          name: {item.name}, _id: {item._id}
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        {this.renderArray()}
      </div>
    )
  }
}
