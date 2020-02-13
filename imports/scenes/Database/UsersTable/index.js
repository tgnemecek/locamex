import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { userTypes } from '/imports/startup/user-types/index';
import tools from '/imports/startup/tools/index';

import RegisterData from '/imports/components/RegisterData/index';
import Icon from '/imports/components/Icon/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';

class UsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: false
    }
  }

  toggleWindow = (item) => {
    if (this.state.item) {
      this.setState({ item: false });
    } else {
      this.setState({ item });
    }
  }

  renderBody = () => {
    return this.props.database.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__wide">
            {item.profile.firstName + " " + item.profile.lastName}
          </td>
          <td>{item.username}</td>
          <td>
            {userTypes[item.profile.type].label}
          </td>
          <td className="hide-at-700px">
            {item.emails[0].address}
          </td>
          <td className="no-padding">
            <button onClick={() => this.toggleWindow(item)}>
              <Icon icon="edit" />
            </button>
          </td>
        </tr>
      )
    })
  }
  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="users"/>
        <div className="__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th className="table__wide">
                  Nome
                </th>
                <th>Login</th>
                <th>Tipo de Usuário</th>
                <th className="hide-at-700px">
                  Email
                </th>
                <th className="no-padding">
                  <button onClick={() => this.toggleWindow({})}>
                    <Icon icon="new" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
        {this.state.item ?
          <RegisterData
            type='users'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}

export default UsersTableWrapper = withTracker((props) => {
  Meteor.subscribe('usersPub');
  var database = Meteor.users.find().fetch() || [];
  return {
    database
  }
})(UsersTable);