import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { version } from '/package.json';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      ready: 1
    }
  }
  // componentDidMount() {
  //   this.tracker = Tracker.autorun(() => {
  //     Meteor.subscribe('usersPub');
  //     var user = Meteor.user();
  //     if (user) {
  //       this.setState({ user, ready: 1 });
  //     } else if (user === null) this.setState({ user, ready: -1 });
  //   })
  // }


  render() {
    console.log(Meteor.user());
    if (this.state.ready === 1) {
      return (
        <div id="app">
          <Route path="/" render={(props) => <AppHeader {...props}/>}/>
            <Switch>
              <Route path="/dashboard" render={(props) => {
                return <ErrorBoundary><Dashboard {...props}/></ErrorBoundary>
              }}/>
              <Route path="/contract/:contractId" render={(props) => {
                return <ErrorBoundary><Contract {...props}/></ErrorBoundary>
              }}/>
              <Route path="/billing/:contractId" render={(props) => {
                return <ErrorBoundary><Billing {...props}/></ErrorBoundary>
              }}/>
              <Route path="/shipping/:contractId" render={(props) => {
                return <ErrorBoundary><Shipping {...props}/></ErrorBoundary>
              }}/>
              <Route path="/proposal/:proposalId" render={(props) => {
                return <ErrorBoundary><Proposal {...props}/></ErrorBoundary>
              }}/>
              <Route path="/database/:database" render={(props) => {
                return <ErrorBoundary><Database {...props}/></ErrorBoundary>
              }}/>
              <Route path="/configuration" render={(props) => {
                return <ErrorBoundary><Configuration {...props}/></ErrorBoundary>
              }}/>
              <Route path="/test" render={(props) => {
                return <ErrorBoundary><Test {...props}/></ErrorBoundary>
              }}/>
              <Route exact path="/" render={() => <Redirect to="/dashboard"/>}/>
              <Route path="*" render={(props) => {
                return <ErrorBoundary><NotFound {...props}/></ErrorBoundary>
              }}/>
            </Switch>
          {/* <Route path="/" render={(props) => <Footer user={this.state.user}/>}/> */}
        </div>
      )
    } else if (this.state.ready === -1) {
      return <Route path="*" render={(props) => <Login {...props} user={this.state.user}/>}/>
    } else if (this.state.ready === 0) {
      return null
    }
  }
}

function Footer(props) {
  return (
    <div className="app-footer">
      <div className="app-user">Logado como {props.user.firstName}</div>
      <div className="app-version">versão {version}</div>
    </div>
  )
}