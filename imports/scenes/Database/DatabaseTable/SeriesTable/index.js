import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Series } from '/imports/api/series/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class SeriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterByContainerId: "",
      filterByPlace: ""
    }
  }

  setFilter = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderFilterOptions = (type) => {
    if (type === "containerId") {
      return this.props.containersDatabase.map((container, i) => {
        return <option key={i} value={container._id}>{container.description}</option>
      })
    } else if (type === "place") {
      return this.props.placesDatabase.map((place, i) => {
        return <option key={i} value={place._id}>{place.description}</option>
      })
    }
  }

  toggleVisualizer = (item) => {
    var visualizer = false
    if (!this.state.visualizer) {
      visualizer = item;
    }
    this.setState({ visualizer });
  }

  renderHeader = () => {
    const toggleEditWindow = () => {
      this.props.toggleEditWindow({});
    }
    const generateReport = () => {
      var header = [[
        "Série",
        "Modelo",
        "Pátio",
        "Observações"
      ]]
      var body = this.props.fullDatabase.map((item) => {
        return [
          item._id,
          item.description,
          item.placeDescription,
          item.observations
        ]
      })
      this.props.generateReport(header.concat(body));
    }
    return (
      <tr>
        <th className="table__small-column">Série</th>
        <th>Modelo</th>
        <th className="table__small-column">Pátio</th>
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

  renderBody = () => {
    var filterByContainerId = this.state.filterByContainerId;
    var filterByPlace = this.state.filterByPlace;
    var filteredDatabase = this.props.fullDatabase.filter((item) => {
      if (filterByContainerId && item.containerId !== filterByContainerId) return false;
      if (filterByPlace && item.placeId !== filterByPlace) return false;
      return true;
    })
    return filteredDatabase.map((item, i) => {
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      const renderEditButton = () => {
        if (tools.isReadAllowed("series.edit")) {
          return (
            <td className="table__small-column">
              <button onClick={toggleEditWindow}>
                <Icon icon="edit" />
              </button>
            </td>
          )
        } else return null;
      }
      return (
        <tr key={i}>
          <td className="table__small-column">
            {item._id}
          </td>
          <td style={{textAlign: 'left'}}>
            {item.description}
          </td>
          <td className="table__small-column">
            {item.placeDescription}
          </td>
          {renderEditButton()}
          <td className="table__small-column">
            <button onClick={toggleImageWindow}>
              <Icon icon="image" />
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
          <RedirectUser currentPage="series"/>
          <Block columns={2}>
            <Input
              title="Modelo"
              type="select"
              name="filterByContainerId"
              onChange={this.setFilter}>
              <option value="" style={{fontStyle: "italic"}}>Mostrar Tudo</option>
              {this.renderFilterOptions("containerId")}
            </Input>
            <Input
              title="Pátio"
              type="select"
              name="filterByPlace"
              onChange={this.setFilter}>
              <option value="" style={{fontStyle: "italic"}}>Mostrar Tudo</option>
              {this.renderFilterOptions("place")}
            </Input>
          </Block>
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

function translatePlaces(placeId, database) {
  if (!placeId) return "-";
  return placeId === "rented" ? "Alugado" : tools.findUsingId(database, placeId).description;
}

export default SeriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('placesPub');
  Meteor.subscribe('containersPub');

  var fullDatabase = Series.find().fetch();
  fullDatabase = tools.sortObjects(fullDatabase, '_id', {convertToNumber: true});

  var containersDatabase = Containers.find().fetch();
  var placesDatabase = Places.find().fetch();
  var ready = !!fullDatabase.length;

  return {
    fullDatabase,
    placesDatabase,
    containersDatabase,
    ready
  }
})(SeriesTable);