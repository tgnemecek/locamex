import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Accessories } from '/imports/api/accessories/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';

import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

import Search from './Search/index';
import FilterBar from './FilterBar/index';

// This class shows an alternate way to apply filters.
// It can be more complicated than the current method in the state
// But the filter is applied during the render with no setting new filtered databases
// So the databases are never updated, just the filter/search values, which cause the render to filter the databases in real time

class AccessoriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      filters: []
    }
    this.filterHere = ['available'];
  }

  filterSearch = (value, property) => {
    if (property === 'search') {
      this.setState({ search: { key: this.state.search.key, value } });
    }
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
        <th className="table__small-column">Inativos</th>
        <th className="table__small-column">Total</th>
        <th className="table__small-column">Valor</th>
        <th className="table__small-column"><button onClick={toggleEditWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {

    var options = {
      searchHere: 'description',
      filterHere: 'available'
    }

    return tools.filterSearch(this.props.fullDatabase, options).map((item, i) => {
      var total = item.available + item.inactive + item.rented;
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
          <td className="table__small-column">{item.inactive}</td>
          <td className="table__small-column">{total}</td>
          <td className="table__small-column">{tools.format(item.price, 'currency')}</td>
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
          <Search
            database={this.props.fullDatabase}
            filterSearch={this.filterSearch}
          />
          <FilterBar
            fields={this.filterHere}
            placesDatabase={this.props.placesDatabase}
            modelsDatabase={this.props.modelsDatabase}
            database={this.props.fullDatabase}
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

export default AccessoriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('accessoriesPub');
  var fullDatabase = Accessories.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(AccessoriesTable);