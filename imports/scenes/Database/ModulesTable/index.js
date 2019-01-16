import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';

import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ModulesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      searchOptions: {
        onlySearchHere: ['description']
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
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    return (
      <tr>
        <th>Descrição</th>
        <th className="table__small-column">Disponíveis</th>
        <th className="table__small-column">Locados</th>
        <th className="table__small-column">Manutenção</th>
        <th className="table__small-column">Inativos</th>
        <th className="table__small-column">Total</th>
        <th className="table__small-column"><button onClick={toggleEditWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      var total = item.available + item.maintenance + item.rented + item.inactive;
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      const toggleTransactionWindow = () => {
        this.props.toggleTransactionWindow(item);
      }
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{item.available}</td>
          <td className="table__small-column">{item.rented}</td>
          <td className="table__small-column">{item.maintenance}</td>
          <td className="table__small-column">{item.inactive}</td>
          <td className="table__small-column">{total}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleTransactionWindow}>⟳</button></td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
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

export default ModulesTableWrapper = withTracker((props) => {
  Meteor.subscribe('modulesPub');
  var fullDatabase = Modules.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(ModulesTable);