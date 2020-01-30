import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Icon from '/imports/components/Icon/index';
import SearchBar from '/imports/components/SearchBar/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

import FlyerCreator from './FlyerCreator/index';

class ContainersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],
      flyerWindow: false
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
    const generateReport = () => {
      debugger;
      var header = [[
        "Descrição",
        "Tipo",
        "Valor Mensal"
      ]]
      var body = this.state.filteredDatabase.map((item) => {
        return [
          item.description,
          translate(item.type),
          item.price
        ]
      })
      this.props.generateReport(header.concat(body));
    }
    return (
      <tr>
        <th>Descrição</th>
        <th className="table__small-column">Tipo</th>
        <th className="table__small-column">Valor Mensal</th>
        <th className="table__small-column">
          <button onClick={generateReport}>
            <Icon icon="report" />
          </button>
        </th>
        <th className="table__small-column">
          <button onClick={toggleEditWindow}>
            <Icon icon="new" />
          </button>
        </th>
      </tr>
    )
  }

  toggleFlyerWindow = (item) => {
    item = item || false;
    this.setState({ flyerWindow: item });
  }

  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      const toggleFlyerWindow = () => {
        this.toggleFlyerWindow(item);
      }
      const toggleStockVisualizer = () => {
        this.props.toggleStockVisualizer(item);
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
          <td className="table__small-column">
            <button onClick={toggleFlyerWindow}>
              <Icon icon="pdf" />
            </button>
          </td>
          <td className="table__small-column">
            <button onClick={toggleEditWindow}>
              <Icon icon="edit" />
            </button>
          </td>
        </tr>
      )
    })
  }

  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="containers"/>
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
          {this.state.flyerWindow ?
            <FlyerCreator
              item={this.state.flyerWindow}
              toggleWindow={this.toggleFlyerWindow} />
          : null}
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

function translate (input) {
  if (input === 'fixed') return 'Fixo';
  if (input === 'modular') return 'Modular';
  return input;
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