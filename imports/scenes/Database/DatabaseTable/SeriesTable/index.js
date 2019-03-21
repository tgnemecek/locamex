import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Series } from '/imports/api/series/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import FilterBar from '/imports/components/FilterBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class SeriesTable extends React.Component {
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
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
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
          <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <FilterBar
            fields={["model", "place"]}
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