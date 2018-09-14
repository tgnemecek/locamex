import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { version } from '/package.json';

import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Test from '/imports/scenes/Test/index';
import Login from '/imports/scenes/Login/index';
import Contract from '/imports/scenes/Contract/index';
import Database from '/imports/scenes/Database/index';

export default App = () => {
  return (
    <div id="app">
      <Route path="/" render={ props => <AppHeader {...props}/> }/>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/contract/:contractId" render={(props) => (
          redirect() ? <Contract {...props}/> : <Redirect to="/"/>
        )}/>
        <Route path="/database/:database" render={(props) => (
          redirect() ? <Database {...props}/> : <Redirect to="/"/>
        )}/>
        <Route path="/test" component={Test}/>
        <Route path="*" component={NotFound}/>
      </Switch>
      <Route path="/" component={AppVersion}/>
    </div>
  )
}

AppVersion = () => {
  return <div className="app-version">versão {version}</div>
}

function redirect() {
  const BYPASS = false;
  if (BYPASS) return true;
  return Meteor.userId();
}