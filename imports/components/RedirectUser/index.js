import React from 'react';
import { Redirect } from 'react-router-dom';

import { userTypes } from '/imports/startup/user-types/index';

export default class RedirectUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
  }

  componentDidMount() {
    if (Meteor.user().type) {
      this.setState({ ready: true });
    }
  }

  componentDidUpdate() {
    if (Meteor.user().type && !this.state.ready) {
      this.setState({ ready: true });
    }
  }

  conditionalRedirect = () => {
    function notAllowed() {
      return <Redirect to="/dashboard" />;
    }
    function allowed() {
      return null;
    }
    function noUser() {
      return <Redirect to="/" />;
    }
    var user = Meteor.user();
    if (!user) return noUser();
    if (user.type === 'administrator') return allowed();
    var allowedPages = userTypes[user.type].pages;
    if (!allowedPages) return notAllowed();
    if (allowedPages.includes(props.currentPage)) {
      return allowed();
    } else return notAllowed();
  }

  render() {
    if (this.state.ready) {
      return this.conditionalRedirect();
    } else return null;
  }
}