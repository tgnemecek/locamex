import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Containers } from '/imports/api/containers/index';

import RegisterData from '/imports/components/RegisterData/index';
import FilterBar from '/imports/components/FilterBar/index';

import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import Icon from '/imports/components/Icon/index';



import FlyerCreator from './FlyerCreator/index';

class ContainersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: '',
      item: false,
      flyer: false
    }
  }

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
  }

  toggleWindow = (item) => {
    if (this.state.item) {
      this.setState({ item: false });
    } else {
      this.setState({ item });
    }
  }

  toggleFlyerWindow = (item) => {
    item = item || false;
    this.setState({ flyer: item });
  }

  renderHeader = () => {
    const generateReport = () => {
      var header = [[
        "Descrição",
        "Tipo",
        "Valor Mensal"
      ]]
      var body = this.props.database.map((item) => {
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
        <th className="table__wide">Descrição</th>
        <th>Tipo</th>
        <th>Valor Mensal</th>
        <th>
          <button onClick={generateReport}>
            <Icon icon="report" />
          </button>
        </th>
        <th>
          <button onClick={() => this.toggleWindow()}>
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
            <td className="table__wide">
              {item.description}
            </td>
            <td>
              {item.type === "fixed" ? "Fixo" : "Modular"}
            </td>
            <td>
              {tools.format(item.price, 'currency')}
            </td>
            <td>
              <button onClick={() => this.toggleFlyerWindow(item)}>
                <Icon icon="pdf" />
              </button>
            </td>
            <td>
              <button onClick={() => this.toggleWindow(item)}>
                <Icon icon="edit" />
              </button>
            </td>
          </tr>
        )
      })
  }

  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="containers"/>
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
        {this.state.item ?
          <RegisterData
            type='containers'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
        {this.state.flyer ?
          <FlyerCreator
            item={this.state.flyer}
            toggleWindow={this.toggleFlyerWindow} />
        : null}
      </ErrorBoundary>
    )
  }
}

export default ContainersTableWrapper = withTracker((props) => {
  Meteor.subscribe('containersPub');
  var database = Containers.find().fetch() || [];
  return {
    database
  }
})(ContainersTable);