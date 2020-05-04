import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Accessories } from '/imports/api/accessories/index';
import { Variations } from '/imports/api/variations/index';
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
        let {
          description,
          available,
          rented,
          inactive,
          price
        } = item;

        return [
          description,
          available,
          rented,
          inactive,
          available + rented + inactive,
          price
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
        <th className="no-padding">
          <button onClick={generateReport}>
            <Icon icon="report" />
          </button>
        </th>
        <th className="no-padding">
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
        return (
          <tr key={i}>
            <td className="table__wide">{item.description}</td>
            <td>{item.available}</td>
            <td>{item.rented}</td>
            <td>{item.inactive}</td>
            <td>
              {item.available + item.rented + item.inactive}
            </td>
            <td>
              {tools.format(item.price, 'currency')}
            </td>
            <td className="no-padding">
              <button
                onClick={() => this.toggleWindow(item, 'edit')}>
                <Icon icon="edit"/>
              </button>
            </td>
            <td className="no-padding">
              <button
                onClick={() => this.toggleWindow(item, 'stock')}>
                <Icon icon="transaction"/>
              </button>
            </td>
            <td className="no-padding">
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
            variations={this.props.variations
              .filter((variation) => {
                return variation.accessory._id ===
                 this.state.item._id
              })}
            toggleWindow={this.toggleWindow}
          />
        : null}
        {this.state.windowType === 'image' ?
          <ImageVisualizer
            item={this.state.item}
            variations={this.props.variations
              .filter((variation) => {
                return variation.accessory._id ===
                 this.state.item._id
              })}
            toggleWindow={this.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}

export default AccessoriesTableWrapper = withTracker((props) => {
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('variationsPub');

  var database = Accessories.find({visible: true}).fetch() || [];
  var variations = Variations.find({visible: true}).fetch() || [];

  return {
    database,
    variations
  }
})(AccessoriesTable);