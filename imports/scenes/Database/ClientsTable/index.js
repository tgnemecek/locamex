import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Clients } from '/imports/api/clients/index';

import RegisterData from '/imports/components/RegisterData/index';
import FilterBar from '/imports/components/FilterBar/index';

import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';



class ClientsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: '',
      item: false
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

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        return tools.findSubstring(
          this.state.filterTerm, [item.description, item.registry])
      })
      .map((item, i) => {
        var formatType = item.type === 'company' ? 'cnpj' : 'cpf';
        return (
          <tr key={i}>
            <td className="table__wide">{item.description}</td>
            <td>{tools.format(item.registry, formatType)}</td>
            <td>{item.type === 'company' ? "PJ" : "PF"}</td>
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
        <RedirectUser currentPage="clients"/>
        <FilterBar
          value={this.state.filterTerm}
          onChange={this.updateFilter}/>
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th className="table__wide">Nome Fantasia</th>
                <th>CNPJ/CPF</th>
                <th>Tipo</th>
                <th>
                  <button onClick={() => this.toggleWindow({})}>
                    <Icon icon="new" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
        {this.state.item ?
          <RegisterData
            type='clients'
            item={this.state.item}
            toggleWindow={this.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}

export default ClientsTableWrapper = withTracker((props) => {
  Meteor.subscribe('clientsPub');
  var database = Clients.find().fetch() || [];
  return {
    database
  }
})(ClientsTable);