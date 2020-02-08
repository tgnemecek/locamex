import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Accounts } from '/imports/api/accounts/index';

import RegisterData from '/imports/components/RegisterData/index';

import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';



class AccountsTable extends React.Component {
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

  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="accounts"/>
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th className="table__wide">Nome da Conta</th>
                <th>Banco</th>
                <th>Agência</th>
                <th>Número da Conta</th>
                <th>
                  <button onClick={() => this.toggleWindow({})}>
                    <Icon icon="new" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.database.map((item, i) => {
                var formatType = item.type === 'company' ? 'cnpj' : 'cpf';
                return (
                  <tr key={i}>
                    <td className="table__wide">
                      {item.description}
                    </td>
                    <td>{item.bank}</td>
                    <td>{item.branch}</td>
                    <td>{item.number}</td>
                    <td>
                      <button onClick={() => this.toggleWindow(item)}>
                        <Icon icon="edit"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {this.state.item ?
          <RegisterData
            type='accounts'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}

export default AccountsTableWrapper = withTracker((props) => {
  Meteor.subscribe('accountsPub');
  var database = Accounts.find({visible: true}).fetch() || [];
  return {
    database
  }
})(AccountsTable);