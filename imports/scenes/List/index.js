import React from 'react';
import { Meteor } from 'meteor/meteor';

import Box from '/imports/components/Box/index';
import { Clients } from '../../api/clients';
import tools from '/imports/startup/tools/index';
import PrivateHeader from '../PrivateHeader';
import SearchBar from '../SearchBar';
import List from '../List';

export default class ListPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: []
    }
    switch (this.props.type) {
      case "clients":
        this.header = [{
          title: "Código",
          value: "_id",
          enableSort: true
        }, {
          title: "Nome Fantasia",
          value: "clientName",
          enableSort: true
        }, {
          title: "Tipo",
          value: "type",
          enableSort: false
        }];
        this.searchOptions = [{
          title: "Nome Fantasia",
          value: "clientName"
        }, {
          title: "Razão Social",
          value: "officialName"
        }, {
          title: "CNPJ",
          value: "cnpj"
        }, {
          title: "Email",
          value: "contactEmail"
        }, {
          title: "CPF",
          value: "contactCPF"
        }, ]
        break;
    }
  }

  componentDidMount() {
    this.Tracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var fullDatabase = Clients.find().fetch();
      this.setState({ fullDatabase, filteredDatabase: fullDatabase });
    })
  }

  sortItems = (value, order) => {
    var sortedDatabase = tools.deepCopy(this.state.filteredDatabase);

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