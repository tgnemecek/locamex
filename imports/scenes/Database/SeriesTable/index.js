import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Series } from '/imports/api/series/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';

import RegisterData from '/imports/components/RegisterData/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';

class SeriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterIdContainer: '',
      filterIdPlace: '',
      windowType: false,
      item: false
    }
  }

  toggleWindow = (item, windowType) => {
    if (!this.state.windowType) {
      this.setState({
        item,
        windowType
      })
    } else {
      this.setState({
        item: false,
        windowType: false
      })
    }
  }

  setFilter = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderFilterOptions = (type) => {
    return this.props[type].map((item, i) => {
      return (
        <option key={i} value={item._id}>
          {item.description}
        </option>
      )
    })
  }

  renderHeader = () => {
    const generateReport = () => {
      var header = [[
        "Série",
        "Modelo",
        "Pátio",
        "Observações"
      ]]
      var body = this.props.database.map((item) => {
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
        <th>Série</th>
        <th className="table__wide">Modelo</th>
        <th>Pátio</th>
        <th>
          <button onClick={generateReport}>
            <Icon icon="report" />
          </button>
        </th>
        <th>
          <button onClick={() => this.toggleWindow({}, 'edit')}>
            <Icon icon="new" />
          </button>
        </th>
      </tr>
    )
  }

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        if (item.container._id === this.state.filterIdContainer) {
          return true;
        } else return item.place._id === this.state.filterIdPlace;
      })
    return filteredDatabase.map((item, i) => {
      const renderEditButton = () => {
        if (tools.isWriteAllowed("series")) {
          return (
            <td>
              <button onClick={() => this.toggleWindow(item, 'edit')}>
                <Icon icon="edit" />
              </button>
            </td>
          )
        } else return null;
      }
      return (
        <tr key={i}>
          <td>
            {item._id}
          </td>
          <td style={{textAlign: 'left'}}>
            {item.container.description}
          </td>
          <td>
            {item.place.description}
          </td>
          {renderEditButton()}
          <td>
            <button onClick={() => this.toggleWindow(item, 'image')}>
              <Icon icon="image" />
            </button>
          </td>
        </tr>
      )
    })
  }

  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="series"/>
        <Block columns={2}>
          <Input
            title="Modelo"
            type="select"
            name="filterIdContainer"
            onChange={this.setFilter}>
            <option value="" style={{fontStyle: "italic"}}>
              Mostrar Tudo
            </option>
            {this.renderFilterOptions("containers")}
          </Input>
          <Input
            title="Pátio"
            type="select"
            name="filterIdPlace"
            onChange={this.setFilter}>
            <option value="" style={{fontStyle: "italic"}}>
              Mostrar Tudo
            </option>
            {this.renderFilterOptions("places")}
          </Input>
        </Block>
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
        {this.state.windowType === 'edit' ?
          <RegisterData
            type='series'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
        {this.state.windowType === 'image' ?
          <ImageVisualizer
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}

export default SeriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('seriesPub');

  var database = Series.find().fetch() || [];
  database = tools.sortObjects(database, '_id', {convertToNumber: true});

  var containers = [];
  var places = [];

  database.forEach((series) => {
    if (!containers.includes(series.container._id)) {
      containers.push(series.container);
    }
    if (!places.includes(series.place._id)) {
      places.push(series.place);
    }
  })

  return {
    database,
    places,
    containers
  }
})(SeriesTable);