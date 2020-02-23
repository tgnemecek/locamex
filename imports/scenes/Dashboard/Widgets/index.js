import React from 'react';
import tools from '/imports/startup/tools/index';
import Agenda from '/imports/components/Agenda/index';

export default function Widgets (props) {
  return (
    <div className="widgets">
      <Agenda/>
    </div>
  )
}