import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

import StockVisualizer from '/imports/components/StockVisualizer/index';
import Transaction from '/imports/components/Transaction/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import AccessoriesTable from './AccessoriesTable/index';
import ClientsTable from './ClientsTable/index';
import ContainersTable from './ContainersTable/index';
import ContractsTable from './ContractsTable/index';
import HistoryTable from './HistoryTable/index';
import MaintenanceTable from './MaintenanceTable/index';
import ModulesTable from './ModulesTable/index';
import PacksTable from './PacksTable/index';
import PlacesTable from './PlacesTable/index';
import ServicesTable from './ServicesTable/index';
import UsersTable from './UsersTable/index';

import RegisterAccessories from '/imports/components/RegisterAccessories/index';
import RegisterClients from '/imports/components/RegisterClients/index';
import RegisterContainers from '/imports/components/RegisterContainers/index';
import RegisterHistory from '/imports/components/RegisterHistory/index';
import RegisterModules from '/imports/components/RegisterModules/index';
import RegisterPacks from '/imports/components/RegisterPacks/index';
import RegisterPlaces from '/imports/components/RegisterPlaces/index';
import RegisterServices from '/imports/components/RegisterServices/index';
import RegisterUsers from '/imports/components/RegisterUsers/index';

export default class Database extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      editWindow: false,
      transactionWindow: false,
      stockVisualizer: false,
      imageWindow: false
    }
  }

  toggleEditWindow = (item) => {
    if (item) {
      this.setState({
        editWindow: !this.state.editWindow,
        item
      });
    } else this.setState({ editWindow: false, item: null });
  }

  toggleStockVisualizer = (item) => {
    if (item) {
      this.setState({
        stockVisualizer: !this.state.stockVisualizer,
        item
      });
    } else this.setState({ stockVisualizer: false, item: null });
  }

  toggleTransactionWindow = (item) => {
    if (item) {
      this.setState({
        transactionWindow: !this.state.transactionWindow,
        item
      });
    } else this.setState({ transactionWindow: false, item: null });
  }

  toggleImageWindow = (item) => {
    if (item) {
      this.setState({
        imageWindow: !this.state.imageWindow,
        item
      });
    } else this.setState({ imageWindow: false, item: null });
  }

  render () {
    var Table;
    var Register;
    if (this.props.match.params.database === 'accessories') {
      Table = AccessoriesTable;
      Register = RegisterAccessories;
    } else if (this.props.match.params.database === 'containers') {
      Table = ContainersTable;
      Register = RegisterContainers;
    } else if (this.props.match.params.database === 'contracts') {
      Table = ContractsTable;
    } else if (this.props.match.params.database === 'clients') {
      Table = ClientsTable;
      Register = RegisterClients;
    } else if (this.props.match.params.database === 'history') {
      Table = HistoryTable;
      Register = RegisterHistory;
    } else if (this.props.match.params.database === 'maintenance') {
      Table = MaintenanceTable;
    } else if (this.props.match.params.database === 'modules') {
      Table = ModulesTable;
      Register = RegisterModules;
    } else if (this.props.match.params.database === 'packs') {
      Table = PacksTable;
      Register = RegisterPacks;
    } else if (this.props.match.params.database === 'places') {
      Table = PlacesTable;
      Register = RegisterPlaces;
    } else if (this.props.match.params.database === 'services') {
      Table = ServicesTable;
      Register = RegisterServices;
    } else if (this.props.match.params.database === 'users') {
      Table = UsersTable;
      Register = RegisterUsers;
    }

    return (
      <>
        <div className="page-content">
          <Table
            item={this.state.item}
            toggleEditWindow={this.toggleEditWindow}
            toggleStockVisualizer={this.toggleStockVisualizer}
            toggleImageWindow={this.toggleImageWindow}
          />
        </div>
        {this.state.stockVisualizer ?
          <StockVisualizer
            type={this.state.item.type}
            item={this.state.item}
            toggleWindow={this.toggleStockVisualizer}
          />
        : null}
        {/* {this.state.transactionWindow ?
          <Transaction
            item={this.state.item}
            toggleWindow={this.toggleTransactionWindow}
          />
        : null} */}
        {this.state.imageWindow ?
          <ImageVisualizer
            item={{...this.state.item, itemType: this.props.match.params.database}}
            toggleWindow={this.toggleImageWindow}
          />
        : null}
        {this.state.editWindow ?
          <Register
            item={this.state.item}
            toggleWindow={this.toggleEditWindow}
          />
        : null}
      </>
    )
  }
}