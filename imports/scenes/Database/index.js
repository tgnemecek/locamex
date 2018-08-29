import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';

import { Accessories } from '/imports/api/accessories/index';
import { Categories } from '/imports/api/categories/index';
import { Clients } from '/imports/api/clients/index';
import { Containers } from '/imports/api/containers/index';
import { Contracts } from '/imports/api/contracts/index';
import { Modules } from '/imports/api/modules/index';
import { Packs } from '/imports/api/packs/index';
import { Pages } from '/imports/api/pages/index';
import { Services } from '/imports/api/services/index';
import { UserTypes } from '/imports/api/user-types/index';
import { Users } from '/imports/api/users/index';

import tools from '/imports/startup/tools/index';
import AppHeader from '/imports/components/AppHeader/index';
import SearchBar from '/imports/components/SearchBar/index';

import AccessoriesTable from './AccessoriesTable/index';
import ClientsTable from './ClientsTable/index';
import ServicesTable from './ServicesTable/index';

import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Database extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      ready: 0,
      item: false
    }
    switch (this.props.params.database) {
      case 'accessories':
          this.Db = Accessories;
          this.pub = 'accessoriesPub';
        break;
      case 'clients':
          this.Db = Clients;
          this.pub = 'clientsPub';
        break;
      case 'services':
          this.Db = Services;
          this.pub = 'servicesPub';
        break;
      default:
    }
  }

  componentDidMount() {
    var fullDatabase;
    var filteredDatabase;
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe(this.pub);
      fullDatabase = this.Db.find({ visible: true }).fetch();
      filteredDatabase = fullDatabase;
      if (fullDatabase) {
        this.setState({ fullDatabase, filteredDatabase, ready: 1 });
      } else this.setState({ ready: -1 });
    })
  }

  returnSort = (filteredDatabase) => {
    this.setState({ filteredDatabase });
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.state.fullDatabase });
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
    if (this.props.params.database === 'accessories') Table = AccessoriesTable;
    if (this.props.params.database === 'clients') Table = ClientsTable;
    if (this.props.params.database === 'services') Table = ServicesTable;
    if (this.state.ready === 1) {
      return (
        <>
          <AppHeader title="Contrato"/>
            <div className="page-content">
              <SearchBar
                database={this.state.fullDatabase}
                options={this.searchOptions}
                searchReturn={this.searchReturn}
              />
              <Table
                item={this.state.item}
                database={this.state.filteredDatabase}
                type={this.props.params.database}
                returnSort={this.returnSort}
                toggleWindow={this.toggleWindow}
              />
            </div>
        </>
      )
    } else if (this.state.ready === 0) {
      return (
        <>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <Loading fullPage={true}/>
          </div>
        </>
      )
    } else if (this.state.ready === -1) {
      return (
        <>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <NotFound/>
          </div>
        </>
      )
    }
  }
}