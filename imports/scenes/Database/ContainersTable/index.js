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
      const renderTransactionButton = () => {
        if (item.type === 'fixed') {
          return <button className="database__table__button" onClick={toggleStockVisualizer}>⟳</button>
        } else return null
      }
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__small-column">{translate(item.type)}</td>
          <td className="table__small-column">{tools.format(item.price, 'currency')}</td>
          <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
          <td className="table__small-column">{renderTransactionButton()}</td>
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