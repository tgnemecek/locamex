import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import RegisterContainers from '/imports/components/RegisterContainers/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ContainersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      searchOptions: {
        onlySearchHere: ['description'],
        filters: [
          {
            label: "Status: (Containers Fixos)",
            key: "status",
            selected: "",
            options: [
              {value: "available", label: "Disponível"},
              {value: "rented", label: "Locado"},
              {value: "maintenance", label: "Manutenção"},
              {value: "inactive", label: "Inativo"}
            ]
          },
          {
            label: "Pátio: (Containers Fixos)",
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
    searchOptions.filters[1].options = placesOptions;
    this.setState({ searchOptions, filteredDatabase: this.props.fullDatabase });
  }

  componentWillUnmount() {
    this.props.handler1.stop();
    this.props.handler2.stop();
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
        <th className="small-column">Série</th>
        <th>Descrição</th>
        <th className="small-column">Tipo</th>
        <th className="small-column">Status</th>
        <th className="small-column">Pátio</th>
        <th className="small-column">Valor Mensal</th>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      function translate (input) {
        if (input === 'available') return 'Disponível';
        if (input === 'rented') return 'Locado';
        if (input === 'maintenance') return 'Manutenção';
        if (input === 'inactive') return 'Inativo';
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
          <td className="small-column">{item.serial || "-"}</td>
          <td>{item.description}</td>
          <td className="small-column">{translate(item.type)}</td>
          <td className="small-column">{translate(item.status) || "Montados: " + item.assembled}</td>
          <td className="small-column">{item.status == "rented" ? "-" : translatePlaces(item.place)}</td>
          <td className="small-column">{tools.format(item.price, 'currency')}</td>
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
            <table className="table database__table database__table--accessories">
              <thead>
                {this.renderHeader()}
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
          {this.props.item ?
            <RegisterContainers
              item={this.props.item}
              toggleWindow={this.props.toggleWindow}
            />
          : null}
        </ErrorBoundary>
      )
    } else if (!this.props.ready) {
      return null;
    }
  }
}

export default ContainersTableWrapper = withTracker((props) => {
  var handler1 = Meteor.subscribe('placesPub');
  var handler2 = Meteor.subscribe('containersPub');
  var placesDatabase = Places.find().fetch();
  var fullDatabase = Containers.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    handler1,
    handler2,
    fullDatabase,
    placesDatabase,
    ready
  }
})(ContainersTable);