import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Redirect } from 'react-router-dom';

import { userTypes } from '/imports/startup/user-types/index';

function RedirectUser(props) {
  if (props.user === null) return <Redirect to="/dashboard" />;
  if (props.user) {
    if (props.user.profile.type === 'administrator') return null;

    var readPages = userTypes[props.user.profile.type].read;
    var writePages = userTypes[props.user.profile.type].write;
    var allowedPages = readPages.concat(writePages);
    if (!allowedPages) return <Redirect to="/dashboard" />;

    if (!allowedPages.includes(props.currentPage)) {
      return <Redirect to="/dashboard" />;
    }

    return null;
  }
}

export default RedirectUserWrapper = withTracker((props) => {

  var user = Meteor.user();

  return { user }

})(RedirectUser);