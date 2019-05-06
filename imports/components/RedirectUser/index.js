import React from 'react';
import { Redirect } from 'react-router-dom';

import { userTypes } from '/imports/startup/user-types/index';

export default function RedirectUser (props) {

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

  var allowedPages = userTypes.find((userType) => user.type === userType.type);


  if (!allowedPages) return notAllowed();
  if (allowedPages.pages.includes(props.currentPage)) {
    return allowed();
  } else return notAllowed();
}