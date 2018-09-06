import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

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
        <Route path="*" component={NotFound}/>
        <Route path="/test" component={Test}/>
      </Switch>
    </div>
  )
}

function redirect() {
  const BYPASS = false;
  if (BYPASS) return true;
  return Meteor.userId();
}