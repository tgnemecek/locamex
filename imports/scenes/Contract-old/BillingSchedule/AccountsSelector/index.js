import React from 'react';
import moment from 'moment';
import Input from '/imports/components/Input/index';
import tools from '/imports/startup/tools/index';

export default class AccountsSelector extends React.Component {
  onChange = (e) => {
    var charges = this.props.charges.map((charge) => {
      return {
        ...charge,
        accountId: e.target.value
      }
    })
    this.props.updateBilling(charges);
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
        value={this.props.charges[0].accountId}
        onChange={this.onChange}>
          <option value=""></option>
          {this.renderOptions()}
      </Input>
    )
  }
}