import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { userTypes } from '/imports/startup/user-types/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';



class UsersTable extends React.Component {
  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Nome</th>
        <th className="table__small-column">Login</th>
        <th className="table__small-column">Tipo de Usuário</th>
        <th className="table__small-column hide-at-700px">Email</th>
        <th className="table__small-column">
          <button onClick={toggleEditWindow}>
            <Icon icon="new" />
          </button>
        </th>
      </tr>
    )
  }
  renderBody = () => {
    return this.props.fullDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.profile.firstName + " " + item.profile.lastName}</td>
          <td>{item.username}</td>
          <td className="table__small-column">
            {userTypes[item.profile.type].label}
          </td>
          <td className="table__small-column hide-at-700px">
            {item.emails[0].address}
          </td>
          <td className="table__small-column">
            <button onClick={toggleEditWindow}>
              <Icon icon="edit" />
            </button>
          </td>
        </tr>
      )
    })
  }
  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="users"/>
          <div className="database__scroll-div">
            <table className="table">
              <thead>
                {this.renderHeader()}
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
        </ErrorBoundary>
      )
    } else if (!this.props.ready) {
      return (
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
          </table>
        </div>
      )
    }
  }
}

export default UsersTableWrapper = withTracker((props) => {
  Meteor.subscribe('usersPub');
  var fullDatabase = Meteor.users.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(UsersTable);