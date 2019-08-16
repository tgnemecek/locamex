import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import tools from '/imports/startup/tools/index';
import { Agenda } from '/imports/api/agenda/index';
import AgendaDisplay from '/imports/components/AgendaDisplay/index';

function Widgets (props) {
  return (
    <div className="widgets">
      <AgendaDisplay agendaDatabase={props.agendaDatabase}/>
    </div>
  )
}

export default WidgetsWrapper = withTracker((props) => {
  Meteor.subscribe('agendaPub');
  var agendaDatabase = Agenda.find().fetch();
  return { agendaDatabase }
})(Widgets);