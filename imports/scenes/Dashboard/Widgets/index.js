import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import tools from '/imports/startup/tools/index';
import { Agenda } from '/imports/api/agenda/index';
import { Contracts } from '/imports/api/contracts/index';
import AgendaDisplay from '/imports/components/AgendaDisplay/index';

function Widgets (props) {
  return (
    <div className="widgets">
      <AgendaDisplay databases={props.databases}/>
    </div>
  )
}

export default WidgetsWrapper = withTracker((props) => {
  Meteor.subscribe('agendaPub');
  Meteor.subscribe('contractsPub');
  var databases = {
    agendaDatabase: Agenda.find().fetch(),
    contractsDatabase: Contracts.find().fetch()
  }

  return { databases }
})(Widgets);