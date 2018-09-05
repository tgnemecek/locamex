import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { BrowserRouter } from 'react-router-dom'
import React from 'react';

import '../imports/startup/moment-configuration/index';
import App from '/imports/components/App/index';

Meteor.startup(() => {
  ReactDOM.render((
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  ), document.getElementById('root'))
});

// import { routes, onAuthChange } from '../imports/routes/index';
// import '../imports/startup/simple-schema-configuration/index';
// import '../imports/startup/moment-configuration/index';
//
// Tracker.autorun(() => {
//   const isAuthenticated = !!Meteor.userId();
//   onAuthChange(isAuthenticated);
// });
//
// Meteor.startup(() => {
//   ReactDOM.render(routes, document.getElementById('app'));
// });