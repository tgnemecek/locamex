import React from 'react';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

export default class MaintenanceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      placesDatabase: [],
      ready: 0
    }
  }

  componentDidMount = () => {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('placesPub');
      Meteor.subscribe('containersPub');
      var placesDatabase = Places.find().fetch();
      var fullDatabase = Containers.find({ status: "maintenance", type: "fixed" }).fetch();
      var filteredDatabase = fullDatabase;
      if (fullDatabase) this.setState({ fullDatabase, filteredDatabase, placesDatabase, ready: 1 });
    })
  }

  componentWillUnmount = () => {
    this.tracker.stop();
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.state.fullDatabase });
  }

  renderHeader = () => {
    return (
      <tr>
        <th className="small-column">Série</th>
        <th>Descrição</th>
        <th className="small-column">Pátio</th>
        <th className="small-column">Observações</th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const translatePlaces = (place) => {
        if (!place) return "-";
        for (var i = 0; i < this.state.placesDatabase.length; i++) {
          if (this.state.placesDatabase[i]._id === place) {
            return this.state.placesDatabase[i].description;
          }
        } return "-";
      }
      return (
        <tr key={i}>
          <td className="small-column">{item.serial}</td>
          <td>{item.description}</td>
          <td className="small-column">{translatePlaces(item.place)}</td>
          <td className="small-column">{item.observations}</td>
        </tr>
      )
    })
  }

  render () {
    if (this.state.ready === 1) {
      return (
        <ErrorBoundary>
          <SearchBar
            database={this.state.fullDatabase}
            options={this.searchOptions}
            searchReturn={this.searchReturn}
          />
          <table className="table database__table database__table--accessories">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </ErrorBoundary>
      )
    } else if (this.state.ready === 0) {
      return <Loading/>
    } else if (this.state.ready === -1) {
      return <NotFound/>
    }
  }
}