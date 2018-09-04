import React from 'react';
import { Switch, Route } from 'react-router-dom'

import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Test from '/imports/scenes/Test/index';
import Login from '/imports/scenes/Login/index';
import Contract from '/imports/scenes/Contract/index';
import Database from '/imports/scenes/Database/index';

export default App = () => {
  return (
    <div id="app">
      {/* <AppHeader/> */}
      <Route path="/" render={ props => <AppHeader {...props}/> }/>
      <Switch>
        <Route path="/test" component={Test}/>
        <Route exact path="/" component={Login}/>
        <Route path="/contract/:contractId" render={(props) => (
          <Contract {...props}/>
        )}/>
        <Route path="/database/:database" render={(props) => (
          <Database {...props}/>
        )}/>
        <Route path="*" component={NotFound}/>
      </Switch>
    </div>
  )
}