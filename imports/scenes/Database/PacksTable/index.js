import React from 'react';
import { Places } from '/imports/api/places/index';
import { Packs } from '/imports/api/packs/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import RegisterPacks from '/imports/components/RegisterPacks/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

export default class PacksTable extends React.Component {
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
      Meteor.subscribe('packsPub');
      var placesDatabase = Places.find().fetch();
      var fullDatabase = Packs.find().fetch();
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
        for (var i = 0; i < this.state.placesDatabase.length; i++) {
          if (this.state.placesDatabase[i]._id === place) {
            return this.state.placesDatabase[i].description;
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
    if (this.state.ready === 1) {
      return (
        <ErrorBoundary>
          <SearchBar
            database={this.state.fullDatabase}
            options={this.searchOptions}
            searchReturn={this.searchReturn}
          />
          <table className="table database__table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.props.item ?
            <RegisterPacks
              item={this.props.item}
              toggleWindow={this.props.toggleWindow}
            />
          : null}
        </ErrorBoundary>
      )
    } else if (this.state.ready === 0) {
      return <Loading/>
    } else if (this.state.ready === -1) {
      return <NotFound/>
    }
  }
}