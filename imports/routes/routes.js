import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Login from '../ui/Login';
import Signup from '../ui/Signup';
import Dashboard from '../ui/Dashboard';
import NotFound from '../ui/NotFound';
import AddService from '../ui/AddService';

import ContractPage from '../ui/pages/ContractPage';
import ListPage from '../ui/pages/ListPage';
// import ListUsers from '../ui/pages/ListUsers';
// import ListUserTypes from '../ui/pages/ListUserTypes';
// import ListClients from '../ui/pages/ListClients';

const unauthenticatedPages = ['/', '/signup'];
const authenticatedPages = ['/dashboard'];
const onEnterPublicPage = () => {
  if (Meteor.userId()) {
      browserHistory.replace('/dashboard');
  }
};
const onEnterPrivatePage = () => {
  if (!Meteor.userId()) {
      browserHistory.replace('/');
  }
};
export const onAuthChange = (isAuthenticated) => {
  const pathname = browserHistory.getCurrentLocation().pathname;
  const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
  const isAuthenticatedPage = authenticatedPages.includes(pathname);

  if (isUnauthenticatedPage && isAuthenticated) {
    browserHistory.replace('/dashboard');
  } else if (isAuthenticatedPage && !isAuthenticated) {
    browserHistory.replace('/');
  }
};

const ListServices = (props) => { return <ListPage type="services"/> };
const ListUsers = (props) => { return <ListPage type="users"/> };
const ListUserTypes = (props) => { return <ListPage type="user-types"/> };
const ListClients = (props) => { return <ListPage type="clients"/> };


export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Login} onEnter={onEnterPublicPage}/>
    <Route path="/signup" component={Signup} onEnter={onEnterPublicPage}/>
    <Route path="/dashboard" component={Dashboard} onEnter={onEnterPrivatePage}/>
    <Route path="/contract/:contractId" component={ContractPage}/>
    {/* <Route path="/listservices" component={ListServices}/>
    <Route path="/listusers" component={ListUsers}/>
    <Route path="/listusertypes" component={ListUserTypes}/> */}
    <Route path="/listclients" component={ListClients}/>
    <Route path="*" component={NotFound}/>
  </Router>
);