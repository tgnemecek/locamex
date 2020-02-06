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
      ready: 0
    }
  }
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('usersPub');
      var user = Meteor.user();
      if (user) {
        this.setState({ user, ready: 1 });
      } else if (user === null) this.setState({ user, ready: -1 });
    })
  }


  render() {
    if (this.state.ready === 1) {
      return (
        <div id="app">
          <Route path="/" render={ props => <AppHeader {...props} user={this.state.user}/> }/>
          <Switch>
            <Route path="/dashboard" render={(props) => <Dashboard {...props} user={this.state.user}/>}/>
            <Route path="/contract/:contractId" render={(props) => <Contract {...props} user={this.state.user}/>}/>
            <Route path="/billing/:contractId" render={(props) => <Billing {...props} user={this.state.user}/>}/>
            <Route path="/shipping/:contractId" render={(props) => <Shipping {...props} user={this.state.user}/>}/>
            <Route path="/proposal/:proposalId" render={(props) => <Proposal {...props} user={this.state.user}/>}/>
            <Route path="/database/:database" render={(props) => <Database {...props} user={this.state.user}/>}/>
            <Route path="/configuration" component={Configuration}/>
            <Route path="/test" component={Test}/>
            <Route exact path="/" render={() => <Redirect to="/dashboard"/>}/>
            <Route path="*" component={NotFound}/>
          </Switch>
          <Route path="/" render={(props) => <Footer user={this.state.user}/>}/>
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