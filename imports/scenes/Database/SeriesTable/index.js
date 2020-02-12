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
    var uniques = [];
    return this.props.database
      .filter((series) => {
        if (uniques.includes(series[type]._id)) {
          return false;
        } else {
          uniques.push(series[type]._id);
          return true;
        }
      })
      .map((item, i) => {
        return (
          <option key={i} value={item[type]._id}>
            {item[type].description}
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
        if (this.state.filterIdContainer) {
          if (item.container._id !== this.state.filterIdContainer) {
            return false;
          }
        }
        if (this.state.filterIdPlace) {
          if (item.place._id !== this.state.filterIdPlace) {
            return false;
          }
        }
        return true;
      })
      .map((item, i) => {
        return (
          <tr key={i}>
            <td>
              {item.description}
            </td>
            <td style={{textAlign: 'left'}}>
              {item.container.description}
            </td>
            <td>
              {item.rented ? "Alugado" : item.place.description}
            </td>
            <td>
              <button onClick={() => this.toggleWindow(item, 'edit')}>
                <Icon icon="edit" />
              </button>
            </td>
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
            {this.renderFilterOptions('container')}
          </Input>
          <Input
            title="Pátio"
            type="select"
            name="filterIdPlace"
            onChange={this.setFilter}>
            <option value="" style={{fontStyle: "italic"}}>
              Mostrar Tudo
            </option>
            {this.renderFilterOptions('place')}
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
  var places = [];

  return {
    database,
    places
  }
})(SeriesTable);