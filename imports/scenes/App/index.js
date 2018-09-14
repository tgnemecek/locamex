import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { version } from '/package.json';

import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Test from '/imports/scenes/Test/index';
import Login from '/imports/scenes/Login/index';
import Contract from '/imports/scenes/Contract/index';
import Database from '/imports/scenes/Database/index';
import Dashboard from '/imports/scenes/Dashboard/index';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false,
      ready: false
    }
  }

  componentDidMount() {
    Tracker.autorun(() => {
      Meteor.subscribe('usersPub');
      const user = Meteor.user();
      const ready = user === false ? false : true;
      this.setState({ user, ready });
    })
  }

  render() {
    if (this.state.ready) {
      if (this.state.user) {
        return (
          <div id="app">
            <Route path="/" render={ props => <AppHeader {...props}/> }/>
            <Switch>
              <Route path="/dashboard" render={(props) => <Dashboard {...props} user={this.state.user}/>}/>
              <Route path="/contract/:contractId" render={(props) => <Contract {...props} user={this.state.user}/>}/>
              <Route path="/database/:database" render={(props) => <Database {...props} user={this.state.user}/>}/>
              <Route path="/test" component={Test}/>
              <Route exact path="/" render={() => <Redirect to="/dashboard"/>}/>
              <Route path="*" component={NotFound}/>
            </Switch>
            <Route path="/" component={AppVersion}/>
          </div>
        )
      } else return <Route path="*" render={(props) => <Login {...props} user={this.state.user}/>}/>
    } else return null;
  }
}

AppVersion = () => {
  return <div className="app-version">versão {version}</div>
}