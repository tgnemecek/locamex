import bugsnag from 'bugsnag-js';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import createPlugin from 'bugsnag-react';

import '../imports/startup/moment-configuration/index';
import App from '/imports/components/App/index';

const bugsnagClient = bugsnag({
  apiKey: 'bca16e3d4f16e82887efee5f8d0bd2c6',
  beforeSend: function (report) {
    report.user = Meteor.user();
  }
});

const ErrorBoundary = bugsnagClient.use(createPlugin(React));

Meteor.startup(() => {
  ReactDOM.render((
    <ErrorBoundary>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ErrorBoundary>
  ), document.getElementById('root'))
});