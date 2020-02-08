import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';
import { version } from '/package.json';
import { withTracker } from 'meteor/react-meteor-data';

import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Test from '/imports/scenes/Test/index';
import Login from '/imports/scenes/Login/index';
import Contract from '/imports/scenes/Contract/index';
import Billing from '/imports/scenes/Billing/index';
import Database from '/imports/scenes/Database/index';
import Dashboard from '/imports/scenes/Dashboard/index';
import Shipping from '/imports/scenes/Shipping/index';
import Proposal from '/imports/scenes/Proposal/index';
import Configuration from '/imports/scenes/Configuration/index';

class App extends React.Component {
  render() {
    var user = Meteor.user();
    if (user) {
      return (
        <BrowserRouter id="app">
          <div>
            <Route path="/" render={(props) => <AppHeader {...props}/>}/>
              <Switch>
                <Route path="/dashboard" render={(props) => {
                  return <Dashboard {...props}/>
                }}/>
                <Route path="/contract/:contractId" render={(props) => {
                  return <Contract {...props}/>
                }}/>
                <Route path="/billing/:contractId" render={(props) => {
                  return <Billing {...props}/>
                }}/>
                <Route path="/shipping/:contractId" render={(props) => {
                  return <Shipping {...props}/>
                }}/>
                <Route path="/proposal/:proposalId" render={(props) => {
                  return <Proposal {...props}/>
                }}/>
                <Route path="/database/:database" render={(props) => {
                  return <Database {...props}/>
                }}/>
                <Route path="/configuration" render={(props) => {
                  return <Configuration {...props}/>
                }}/>
                <Route path="/test" render={(props) => {
                  return <Test {...props}/>
                }}/>
                <Route exact path="/" render={() => <Redirect to="/dashboard"/>}/>
                <Route path="*" render={(props) => {
                  return <NotFound {...props}/>
                }}/>
              </Switch>
            <Route path="/" render={() => {
              return (
                <div className="app__footer">
                  <div className="app__footer__user">
                    Logado como {user.profile.firstName}
                  </div>
                  <div className="app__footer__version">
                    versão {version}
                  </div>
                </div>
              )
            }}/>
          </div>
        </BrowserRouter>
      )
    } else if (user === null) { // User is not logged in
      return <Route path="*" render={(props) => <Login {...props}/>}/>
    } else return null; // Still checking for user's login status
  }
}

export default AppWrapper = withTracker((props) => {
  var user = Meteor.user(); // This is to make the wrapper reactive
  return {
    ...props
  }
})(App);