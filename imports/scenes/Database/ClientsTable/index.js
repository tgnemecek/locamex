import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Clients } from '/imports/api/clients/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ClientsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      searchOptions: {
        onlySearchHere: ['description', 'officialName', 'registry']
      }
    }
  }

  componentDidMount() {
    this.updateDatabases();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateDatabases();
    }
  }

  updateDatabases = () => {
    this.setState({ filteredDatabase: this.props.fullDatabase });
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.props.fullDatabase });
  }

  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th>Nome Fantasia</th>
        <th className="small-column">CNPJ/CPF</th>
        <th className="small-column">Tipo</th>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      var formatType = item.type === 'company' ? 'cnpj' : 'cpf';
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="small-column">{tools.format(item.registry, formatType)}</td>
          <td className="small-column">{item.type === 'company' ? "PJ" : "PF"}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <SearchBar
            database={this.props.fullDatabase}
            options={this.state.searchOptions}
            searchReturn={this.searchReturn}
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
      return null;
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