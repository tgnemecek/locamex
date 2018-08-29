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
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import AppHeader from '/imports/components/AppHeader/index';
import SearchBar from '/imports/components/SearchBar/index';
import Table from './Table/index';
import RegisterClients from '/imports/components/RegisterClients/index';
import RegisterServices from '/imports/components/RegisterServices/index';
import RegisterAccessories from '/imports/components/RegisterAccessories/index';
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
    var ChosenComponent;
    switch (this.props.params.database) {
      case 'accessories':
        ChosenComponent = RegisterAccessories;
        break;
      case 'clients':
        ChosenComponent = RegisterClients;
        break;
      case 'services':
        ChosenComponent = RegisterServices;
        break;
      default:
        ChosenComponent = NotFound;
    }
    if (this.state.ready === 1) {
      return (
        <ErrorBoundary>
          <AppHeader title="Contrato"/>
            <div className="page-content">
              <SearchBar
                database={this.state.fullDatabase}
                options={this.searchOptions}
                searchReturn={this.searchReturn}
              />
              <Table
                database={this.state.filteredDatabase}
                type={this.props.params.database}
                toggleWindow={this.toggleWindow}
              />
              {this.state.item ?
                <ChosenComponent
                  item={this.state.item}
                  type={this.props.params.database}
                  toggleWindow={this.toggleWindow}
                />
              : null}
            </div>
        </ErrorBoundary>
      )
    } else if (this.state.ready === 0) {
      return (
        <ErrorBoundary>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <Loading fullPage={true}/>
          </div>
        </ErrorBoundary>
      )
    } else if (this.state.ready === -1) {
      return (
        <ErrorBoundary>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <NotFound/>
          </div>
        </ErrorBoundary>
      )
    }
  }
}