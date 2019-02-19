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
        <th>Descrição</th>
        <th className="table__small-column">Disponíveis</th>
        <th className="table__small-column">Locados</th>
        <th className="table__small-column">Inativos</th>
        <th className="table__small-column">Total</th>
        <th className="table__small-column"><button onClick={toggleEditWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      const toggleStockVisualizer = () => {
        this.props.toggleStockVisualizer(item);
      }
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      function count(places, which) {
        return places.reduce((acc, cur) => {
          return acc + cur[which];
        }, 0);
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{count(item.place, 'available')}</td>
          <td className="table__small-column">{item.rented}</td>
          <td className="table__small-column">{count(item.place, 'inactive')}</td>
          <td className="table__small-column">{count(item.place, 'available') + count(item.place, 'inactive')}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleStockVisualizer}>⟳</button></td>
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
            searchHere={['description']}
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

export default ModulesTableWrapper = withTracker((props) => {
  Meteor.subscribe('modulesPub');
  var fullDatabase = Modules.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    ready
  }
})(ModulesTable);