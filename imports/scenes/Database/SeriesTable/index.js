import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Series } from '/imports/api/series/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class SeriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      searchOptions: {
        onlySearchHere: ['serial', 'description', 'observations'],
        filters: [
          {
            label: "Pátio:",
            key: "place",
            selected: "",
            options: []
          }
        ]
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
    var searchOptions = { ...this.state.searchOptions };
    var placesOptions = this.props.placesDatabase.map((place) => {
      return {value: place._id, label: place.description}
    })
    searchOptions.filters[0].options = placesOptions;
    this.setState({ searchOptions, filteredDatabase: this.props.fullDatabase });
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
        <th className="table__small-column">Série</th>
        <th className="table__small-column">Modelo</th>
        <th className="table__small-column">Pátio</th>
        <th>Observações</th>
        <th className="table__small-column"><button onClick={toggleEditWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const translatePlaces = (place) => {
        if (!place) return "-";
        return tools.findUsingId(this.props.placesDatabase, place).description;
      }
      const translateModels = (model) => {
        if (!model) return "-";
        return tools.findUsingId(this.props.modelsDatabase, model).description;
      }
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      return (
        <tr key={i}>
          <td className="table__small-column">{item.serial}</td>
          <td className="table__small-column" style={{textAlign: 'left'}}>{translateModels(item.model)}</td>
          <td className="table__small-column">{translatePlaces(item.place)}</td>
          <td className="table__small-column--wrap">{item.observations}</td>
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

export default SeriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('placesPub');
  Meteor.subscribe('containersPub');

  var fullDatabase = Series.find().fetch();
  fullDatabase = tools.sortObjects(fullDatabase, 'serial');

  var modelsDatabase = Containers.find().fetch();
  var placesDatabase = Places.find().fetch();
  var ready = !!fullDatabase.length;

  return {
    fullDatabase,
    placesDatabase,
    modelsDatabase,
    ready
  }
})(SeriesTable);