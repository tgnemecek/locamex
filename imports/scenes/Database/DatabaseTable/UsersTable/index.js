import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class UsersTable extends React.Component {
  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Nome</th>
        <th className="table__small-column">Login</th>
        <th className="table__small-column">Email</th>
        <th className="table__small-column"><button onClick={toggleEditWindow} className="database__table__button">+</button></th>
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
          <td>{item.firstName + " " + item.lastName}</td>
          <td>{item.username}</td>
          <td className="table__small-column">{item.emails[0].address}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
        </tr>
      )
    })
  }
  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <div className="database__scroll-div">
            <table className="table database__table">
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
          <table className="table database__table">
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