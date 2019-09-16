import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Accounts } from '/imports/api/accounts/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class AccountsTable extends React.Component {
  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Nome da Conta</th>
        <th className="table__small-column">Banco</th>
        <th className="table__small-column">Agência</th>
        <th className="table__small-column">Número da Conta</th>
        <th className="table__small-column">
          <Icon icon="new" onClick={toggleEditWindow} />
        </th>
      </tr>
    )
  }

  renderBody = () => {
    return this.props.fullDatabase.map((item, i) => {
      var formatType = item.type === 'company' ? 'cnpj' : 'cpf';
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">
            {item.bank}
          </td>
          <td className="table__small-column">
            {item.branch}
          </td>
          <td className="table__small-column">
            {item.number}
          </td>
          <td className="table__small-column">
            <Icon icon="edit" onClick={toggleEditWindow} />
          </td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="accounts"/>
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

export default AccountsTableWrapper = withTracker((props) => {
  Meteor.subscribe('accountsPub');
  var fullDatabase = Accounts.find({visible: true}).fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(AccountsTable);