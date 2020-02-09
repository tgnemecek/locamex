import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Modules } from '/imports/api/modules/index';

import RegisterData from '/imports/components/RegisterData/index';
import StockVisualizer from '/imports/components/StockVisualizer/index';
import FilterBar from '/imports/components/FilterBar/index';

import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Icon from '/imports/components/Icon/index';

class ModulesTable extends React.Component {
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
        "Total"
      ]]
      var body = this.props.database.map((item) => {
        var available = count(item.places, 'available');
        var inactive = count(item.places, 'inactive');
        return [
          item.description,
          available,
          item.rented,
          inactive,
          available + item.rented + inactive
        ]
      })
      this.props.generateReport(header.concat(body));
    }
    return (
      <tr>
        <th className="table__wide">Descrição</th>
        <th>Disponíveis</th>
        <th>Locados</th>
        <th>Inativos</th>
        <th>Total</th>
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
        var available = count(item.places, 'available');
        var inactive = count(item.places, 'inactive');
        return (
          <tr key={i}>
            <td className="table__wide">{item.description}</td>
            <td>{available}</td>
            <td>{item.rented}</td>
            <td>{inactive}</td>
            <td>{available + item.rented + inactive}</td>
            <td>
              <button onClick={() => this.toggleWindow(item, 'edit')}>
                <Icon icon="edit" />
              </button>
            </td>
            <td>
              <button onClick={() => this.toggleWindow(item, 'stock')}>
                <Icon icon="transaction"  />
              </button>
            </td>
          </tr>
        )
      })
  }
  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="modules"/>
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
            type='modules'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
        {this.state.windowType === 'stock' ?
          <StockVisualizer
            type='modules'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}

function count(places, which) {
  return places.reduce((acc, cur) => {
    return acc + cur[which];
  }, 0);
}

export default ModulesTableWrapper = withTracker((props) => {
  Meteor.subscribe('modulesPub');
  var database = Modules.find().fetch() || [];
  return {
    database
  }
})(ModulesTable);