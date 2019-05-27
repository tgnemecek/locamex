import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Clients } from '/imports/api/clients/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import Button from '/imports/components/Button/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ClientsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: []
    }
  }

  componentDidMount() {
    this.setState({ filteredDatabase: this.props.fullDatabase });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ filteredDatabase: this.props.fullDatabase });
    }
  }

  filterSearch = (filteredDatabase) => {
    this.setState({ filteredDatabase });
  }

  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Nome Fantasia</th>
        <th className="table__small-column">CNPJ/CPF</th>
        <th className="table__small-column">Tipo</th>
        <th className="table__small-column"><Button icon="new" onClick={toggleEditWindow} /></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      var formatType = item.type === 'company' ? 'cnpj' : 'cpf';
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{tools.format(item.registry, formatType)}</td>
          <td className="table__small-column">{item.type === 'company' ? "PJ" : "PF"}</td>
          <td className="table__small-column"><Button icon="edit" onClick={toggleEditWindow} /></td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="clients"/>
          <SearchBar
            database={this.props.fullDatabase}
            searchHere={['description', 'registry']}
            filterSearch={this.filterSearch}
          />
          <div className="database__scroll-div">
            <table className="table database__table">
              <thead>
                {this.renderHeader()}
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
        </ErrorBoundary>
      )
    } else if (!this.props.ready) {
      return (
        <div className="database__scroll-div">
          <table className="table database__table">
            <thead>
              {this.renderHeader()}
            </thead>
          </table>
        </div>
      )
    }
  }
}

export default ClientsTableWrapper = withTracker((props) => {
  Meteor.subscribe('clientsPub');
  var fullDatabase = Clients.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(ClientsTable);