import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import tools from '/imports/startup/tools/index';
import Button from '/imports/components/Button/index';
import RedirectUser from '/imports/components/RedirectUser/index';
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
        <th className="table__small-column">Tipo de Usuário</th>
        <th className="table__small-column">Email</th>
        <th className="table__small-column"><Button icon="new" onClick={toggleEditWindow} /></th>
      </tr>
    )
  }
  renderBody = () => {
    function translate(type) {
      switch (type) {
        case 'administrator':
          return "Administrador";
          break;
        case "sales":
          return "Vendas";
          break;
        case "finances":
          return "Financeiro";
          break;
        case "maintenance":
          return "Manutenção";
          break;
        default:
          return "-"
      }
    }
    return this.props.fullDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.firstName + " " + item.lastName}</td>
          <td>{item.username}</td>
          <td className="table__small-column">{translate(item.type)}</td>
          <td className="table__small-column">{item.emails[0].address}</td>
          <td className="table__small-column"><Button icon="edit" onClick={toggleEditWindow} /></td>
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