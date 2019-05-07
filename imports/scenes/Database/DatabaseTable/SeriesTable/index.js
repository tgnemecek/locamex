import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Series } from '/imports/api/series/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';

import tools from '/imports/startup/tools/index';
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
    var filterByContainerId = this.state.filterByContainerId;
    var filterByPlace = this.state.filterByPlace;
    var filteredDatabase = this.props.fullDatabase.filter((item) => {
      if (filterByContainerId && item.containerId !== filterByContainerId) return false;
      if (filterByPlace && item.place !== filterByPlace) return false;
      return true;
    })
    return filteredDatabase.map((item, i) => {
      const translatePlaces = (place) => {
        if (!place) return "-";
        return tools.findUsingId(this.props.placesDatabase, place).description;
      }
      const translateModels = (model) => {
        if (!model) return "-";
        return tools.findUsingId(this.props.containersDatabase, model).description;
      }
      const toggleEditWindow = () => {
        this.props.toggleEditWindow(item);
      }
      const toggleImageWindow = () => {
        this.props.toggleImageWindow(item);
      }
      const renderEditButton = () => {
        if (tools.isUserAllowed("series.edit")) {
          return <td className="table__small-column"><button className="database__table__button" onClick={toggleEditWindow}>✎</button></td>
        } else return null;
      }
      return (
        <tr key={i}>
          <td className="table__small-column">{item._id}</td>
          <td className="table__small-column" style={{textAlign: 'left'}}>{translateModels(item.containerId)}</td>
          <td className="table__small-column">{translatePlaces(item.place)}</td>
          <td className="table__small-column--wrap">{item.observations}</td>
          {renderEditButton()}
          <td className="table__small-column"><button className="database__table__button" onClick={toggleImageWindow}>🔍</button></td>
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

export default SeriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('placesPub');
  Meteor.subscribe('containersPub');

  var fullDatabase = Series.find().fetch();
  fullDatabase = tools.sortObjects(fullDatabase, '_id');

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