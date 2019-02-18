import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ContainersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: []
    }
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
        <th className="table__small-column">Tipo</th>
        <th className="table__small-column">Valor Mensal</th>
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
      function translate (input) {
        if (input === 'fixed') return 'Fixo';
        if (input === 'modular') return 'Modular';
        return input;
      }
      const translatePlaces = (place) => {
        if (!place) return "-";
        for (var i = 0; i < this.props.placesDatabase.length; i++) {
          if (this.props.placesDatabase[i]._id === place) {
            return this.props.placesDatabase[i].description;
          }
        } return "-";
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{translate(item.type)}</td>
          <td className="table__small-column">{tools.format(item.price, 'currency')}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
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

export default ContainersTableWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  Meteor.subscribe('containersPub');
  var placesDatabase = Places.find().fetch();
  var fullDatabase = Containers.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    placesDatabase,
    ready
  }
})(ContainersTable);