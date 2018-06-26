import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Clients } from '../api/clients';

import PrivateHeader from './PrivateHeader';
import List from './List';

export default class ListClients extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      database: [],
      editOpen: false,
      data: {}
    }
    // this.createNewButton = <th><ClientItem key={0} formType="company" createNew={true}/></th>
  };

  componentDidMount() {
    this.clientsTracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      const database = Clients.find().fetch();
      this.setState({ database });
    })
  }

  render() {
    return (
      <div>
        <PrivateHeader title="Clientes"/>
        <div className="page-content">
          <List
            type="clients"
            header={[{title: "Código", style: {}}, {title: "Nome Fantasia", style: {flexGrow: 1}}]}
            editButton={true}
            createNewButton={this.createNewButton}
            database={this.state.database}
            />
        </div>
        {/* <ClientItem
          editOpen={this.state.editOpen}
          closeEditWindow={this.closeEditWindow}
          data={this.state.data}
          /> */}
      </div>
      )
  }
}