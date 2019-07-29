import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Redirect } from 'react-router-dom';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';



class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: ''
    }
  }

  onClick = () => {
    var reader = new FileReader();
    reader.onloadend = () => {
      Meteor.call('aws', reader.result, (err, res) => {
        if (err) console.log(err);
        if (res) console.log("DONE!");
      })
    }
    reader.readAsDataURL(this.state.file);
  }

  setFile = (e) => {
    this.setState({ file: e.target.files[0] });
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.setFile}/>
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