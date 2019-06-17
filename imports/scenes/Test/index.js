import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';
import { Redirect } from 'react-router-dom';

import tools from '/imports/startup/tools/index';
import createExcel from '/imports/api/create-excel/index';
import Button from '/imports/components/Button/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';
import Input from '/imports/components/Input/index';

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 10
    }
  }
  funcaoA = (e) => {
    alert(this.funcaoB("chair"));
  }

  funcaoB = (mensagem) => {
    var resposta;
    if (mensagem == "chair") {
      resposta = "cadeira";
    }
    return resposta;
  }

  render() {
    return (
      <div>
        <button onClick={this.funcaoA}>BOTAO</button>
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