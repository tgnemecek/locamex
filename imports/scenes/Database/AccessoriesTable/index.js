import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Accessories } from '/imports/api/accessories/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';

import RegisterData from '/imports/components/RegisterData/index';
import StockVisualizer from '/imports/components/StockVisualizer/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';
import FilterBar from '/imports/components/FilterBar/index';

import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Icon from '/imports/components/Icon/index';

class AccessoriesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: '',
      windowType: false,
      item: false
    }
  }

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
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

  renderHeader = () => {
    const generateReport = () => {
      var header = [[
        "Descrição",
        "Disponíveis",
        "Locados",
        "Inativos",
        "Total",
        "Valor Mensal"
      ]]
      var body = this.props.database.map((item) => {
        var available = count(item, 'available');
        var rented = countRented(item);
        var inactive = count(item, 'inactive');
        return [
          item.description,
          available,
          rented,
          inactive,
          available + rented + inactive,
          item.price
        ]
      })
      this.props.generateReport(header.concat(body), 'accessories');
    }
    return (
      <tr>
        <th className="table__wide">Descrição</th>
        <th>Disponíveis</th>
        <th>Locados</th>
        <th>Inativos</th>
        <th>Total</th>
        <th>Valor Mensal</th>
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
        return tools.findSubstring(
          this.state.filterTerm, item.description
        )
      })
      .map((item, i) => {
        var available = count(item, 'available');
        var rented = countRented(item);
        var inactive = count(item, 'inactive');
        return (
          <tr key={i}>
            <td className="table__wide">{item.description}</td>
            <td>{available}</td>
            <td>{rented}</td>
            <td>{inactive}</td>
            <td>{available + rented + inactive}</td>
            <td>
              {tools.format(item.price, 'currency')}
            </td>
            <td>
              <button
                onClick={() => this.toggleWindow(item, 'edit')}>
                <Icon icon="edit"/>
              </button>
            </td>
            <td>
              <button
                onClick={() => this.toggleWindow(item, 'stock')}>
                <Icon icon="transaction"/>
              </button>
            </td>
            <td>
              <button onClick={() => this.toggleWindow(item, 'image')}>
                <Icon icon="image"/>
              </button>
          </td>
          </tr>
        )
      })
  }

  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="accessories"/>
        <FilterBar
          value={this.state.filterTerm}
          onChange={this.updateFilter}/>
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
            type='accessories'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
        {this.state.windowType === 'stock' ?
          <StockVisualizer
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

function count(item, which) {
  var result = 0;
  item.variations.forEach((variation) => {
    result = result + variation.places.reduce((acc, cur) => {
      return acc + cur[which];
    }, 0);
  })
  return result;
}

function countRented(item) {
  var result = 0;
  return item.variations.reduce((acc, cur) => {
    return acc + cur.rented;
  }, 0);
}

export default AccessoriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('accessoriesPub');
  var database = Accessories.find({visible: true}).fetch() || [];
  return {
    database
  }
})(AccessoriesTable);