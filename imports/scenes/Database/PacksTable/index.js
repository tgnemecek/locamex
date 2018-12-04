import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import { Packs } from '/imports/api/packs/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class PacksTable extends React.Component {
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
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th>Descrição</th>
        <th className="small-column">Pátio</th>
        <th className="small-column"></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
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
          <td className="small-column">{translatePlaces(item.place)}</td>
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

export default PacksTableWrapper = withTracker((props) => {
  Meteor.subscribe('placesPub');
  Meteor.subscribe('packsPub');
  var fullDatabase = Packs.find().fetch();
  var placesDatabase = Places.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    placesDatabase,
    ready
  }
})(PacksTable);