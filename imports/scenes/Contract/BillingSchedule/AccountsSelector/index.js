import React from 'react';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import { Accounts } from '/imports/api/accounts/index';
import Input from '/imports/components/Input/index';
import tools from '/imports/startup/tools/index';

class AccountsSelector extends React.Component {
  onChange = (e) => {
    var account = this.props.accountsDatabase.find((account) => {
      return account._id === e.target.value;
    }) || {};

    var billing = this.props.billing.map((bill) => {
      return {
        ...bill,
        account
      }
    })
    this.props.updateBilling(billing);
  }
  renderOptions = () => {
    return this.props.accountsDatabase.map((item, i) => {
      return (
        <option key={i} value={item._id}>{item.description}</option>
      )
    })
  }
  render() {
    return (
      <Input
        title="Conta:"
        type="select"
        disabled={this.props.disabled}
        value={this.props.billing[0].account._id}
        onChange={this.onChange}>
          <option value=""></option>
          {this.renderOptions()}
      </Input>
    )
  }
}

export default AccountsSelectorWrapper = withTracker((props) => {
  Meteor.subscribe('accountsPub');

  var accountsDatabase = Accounts.find().fetch() || [];

  return {
    accountsDatabase
  }
})(AccountsSelector);