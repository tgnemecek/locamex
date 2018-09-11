import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import AccessoriesTable from './AccessoriesTable/index';
import ClientsTable from './ClientsTable/index';
import ContainersTable from './ContainersTable/index';
import ContractsTable from './ContractsTable/index';
import ModulesTable from './ModulesTable/index';
import PacksTable from './PacksTable/index';
import ServicesTable from './ServicesTable/index';
import UsersTable from './UsersTable/index';

export default class Database extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: false
    }
  }

  toggleWindow = (item) => {
    if (!this.state.item) {
      if (item) this.setState({ item });
      else this.setState({ item: {} });
    }
    else this.setState({ item: false });
  }

  render () {
    var Table;
    if (this.props.match.params.database === 'accessories') Table = AccessoriesTable;
    if (this.props.match.params.database === 'containers') Table = ContainersTable;
    if (this.props.match.params.database === 'contracts') Table = ContractsTable;
    if (this.props.match.params.database === 'clients') Table = ClientsTable;
    if (this.props.match.params.database === 'modules') Table = ModulesTable;
    if (this.props.match.params.database === 'packs') Table = PacksTable;
    if (this.props.match.params.database === 'services') Table = ServicesTable;
    if (this.props.match.params.database === 'users') Table = UsersTable;
    return (
      <>
        <div className="page-content">
          <Table
            key={this.key}
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        </div>
      </>
    )
  }
}