import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';

import { Accessories } from '/imports/api/accessories';
import { Categories } from '/imports/api/categories';
import { Clients } from '/imports/api/clients';
import { Containers } from '/imports/api/containers';
import { Contracts } from '/imports/api/contracts';
import { Modules } from '/imports/api/modules';
import { Packs } from '/imports/api/packs';
import { Pages } from '/imports/api/pages';
import { Services } from '/imports/api/services';
import { UserTypes } from '/imports/api/user-types';
import { Users } from '/imports/api/users';

import tools from '/imports/startup/tools/index';

import AppHeader from '/imports/components/AppHeader/index';
import SearchBar from '/imports/components/SearchBar/index';
import Table from './Table/index';
import RegisterClients from '/imports/components/RegisterClients/index';
import RegisterServices from '/imports/components/RegisterServices/index';
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
      case 'clients':
          this.Db = Clients;
          this.pub = 'clientsPub';
          this.Window = RegisterClients;
        break;
      case 'services':
          this.Db = Services;
          this.pub = 'servicesPub';
          this.Window = RegisterServices;
        break;
      default:
    }
  }

  componentDidMount() {
    var fullDatabase;
    var filteredDatabase;
    this.contractsTracker = Tracker.autorun(() => {
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
    if (!this.state.item) this.setState({ item });
    else this.setState({ item: false });
  }

  render () {
    var ChosenComponent;
    switch (this.props.params.database) {
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
        <>
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