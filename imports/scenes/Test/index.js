import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Test } from '/imports/api/test/index';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  onClick = () => {
    Meteor.call('users.test')
  }
  render() {
    return (
      <div>
        <div className="row">
          <div>Data</div>
          <div>Tipo</div>
          <div>Qtd.</div>
          <div>Produto</div>
          <div>Série/Variação</div>
          <div>Origem/Destino</div>
          <div></div>
        </div>
        <div className="row">
          <div>17-02-2020</div>
          <div>Envio</div>
          <div>1</div>
          <div>Loca 300 M</div>
          <div>M0014</div>
          <div>Antonio Pepe 52</div>
          <div>P</div>
        </div>
      </div>
    )
  }
}

export default TestWrap = withTracker((props) => {
  // Meteor.subscribe('testPub');
  // var data = Test.find().fetch();
  return {
    array: [{places: ["a", "b"]}, {places: ["c", "d"]}]
  }
})(TestPage);