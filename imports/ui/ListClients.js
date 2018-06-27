import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Clients } from '../api/clients';

import PrivateHeader from './PrivateHeader';
import SearchBar from './SearchBar';
import List from './List';

export default class ListClients extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: []
    }
  };

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var fullDatabase = Clients.find().fetch();
      this.setState({ fullDatabase, filteredDatabase: fullDatabase });
    })
  }

  searchReturn = (filteredDatabase) => {
    this.setState({ filteredDatabase });
  }

  render() {
    return (
      <div>
        <PrivateHeader title="Clientes"/>
        <div className="page-content">
          <SearchBar
            database={this.state.fullDatabase}
            options={[{title: "Nome Fantasia", value: "clientName"}]}
            searchReturn={this.searchReturn}/>
          <List
            type="clients"
            header={[{title: "Código"}, {title: "Nome Fantasia", style: {flexGrow: 1}}, {title: "Tipo"}]}
            editButton={true}
            createNewButton={this.createNewButton}
            database={this.state.filteredDatabase}
            />
        </div>
      </div>
      )
  }
}