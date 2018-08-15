import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Clients } from '../../api/clients';
import customTypes from '/imports/startup/custom-types';
import PrivateHeader from '../PrivateHeader';
import SearchBar from '../SearchBar';
import List from '../List';

export default class ListServices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: []
    }
    this.header = [{
      title: "Código",
      value: "_id",
      enableSort: true
    }, {
      title: "Serviço",
      value: "description",
      enableSort: true
    }, {
      title: "Preço",
      value: "price",
      enableSort: true
    }];
    this.searchOptions = [{
      title: "Serviço",
      value: "description"
    }, {
      title: "Preço",
      value: "price"
    }]
  };

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('servicesPub');
      var fullDatabase = Services.find().fetch();
      this.setState({ fullDatabase, filteredDatabase: fullDatabase });
    })
  }

  sortItems = (value, order) => {
    var sortedDatabase = customTypes.deepCopy(this.state.filteredDatabase);

    sortedDatabase.sort((a, b) => {
      if (a[value] < b[value]) return order ? -1 : 1;
      if (a[value] > b[value]) return order ? 1 : -1;
      return 0;
    })
    this.setState({filteredDatabase: sortedDatabase});
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.state.fullDatabase });
  }

  render() {
    return (
      <div>
        <PrivateHeader title="Clientes"/>
        <div className="page-content">
          <SearchBar
            database={this.state.fullDatabase}
            options={this.searchOptions}
            searchReturn={this.searchReturn}/>
          <List
            type="clients"
            header={this.header}
            editButton={true}
            database={this.state.filteredDatabase}
            sortItems={this.sortItems}
            />
        </div>
      </div>
      )
  }
}