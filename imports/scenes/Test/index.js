import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Redirect } from 'react-router-dom';

import tools from '/imports/startup/tools/index';
import Button from '/imports/components/Button/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "nada"
    }
  }

  onClick = () => {
    var a = [
      {
        _id: "84f07fa8638398929e3cc541",
        productId: "0b661bc061f28029fbbdafb7",
        type: "fixed",
        price: 300,
        renting: 1
      }
    ]
    var b = [
      {
        _id: "84f07fa8638398929e3cc541",
        productId: "0b661bc061f28029fbbdafb7",
        type: "fixed",
        price: 300,
        renting: 1
      },
      {
        _id: "4b7140651203c1e1a2ca067c",
        productId: "0b661bc061f28029fbbdafb7",
        type: "modular",
        price: 4000,
        renting: 1
      }
    ]
    var result = tools.compare(a, b);
    if (result) {
      result = "true";
    } else result = "false";
    this.setState({ result });
  }

  render() {
    return (
      <div>
        {this.state.result}
        <button onClick={this.onClick}>BOTAO</button>
      </div>

    )
  }
}

class Test2 extends React.Component {
  message = (callback) => {
    new Test3().a(callback);
  }
}

class Test3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }
  a = (callback) => {
    this.setState({ value: this.state.value+1 }, () => {
      callback()
    })
  }
  render() {
    return (
      <div>
        {this.state.value}
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