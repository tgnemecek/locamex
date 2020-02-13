import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';

import FilterBar from '/imports/components/FilterBar/index';

import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Status from '/imports/components/Status/index';

class ContractsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTerm: ''
    }
  }

  updateFilter = (e) => {
    this.setState({ filterTerm: e.target.value });
  }

  renderBody = () => {
    return this.props.database
      .filter((item) => {
        return tools.findSubstring(this.state.filterTerm, [
          item._id, item.clientDescription, item.clientRegistry
        ])
      })
      .map((item, i) => {
        const renderContractButton = () => {
          if (tools.isReadAllowed("contract")) {
            return (
              <td className="no-padding">
                <Link key={i} to={"/contract/" + item._id}>
                  <Icon icon="edit"/>
                </Link>
              </td>
            )
          } else return null;
        }
        const renderBillingButton = () => {
          if (tools.isReadAllowed("billing") && item.status === "active") {
            return (
              <td className="no-padding">
                <Link key={i} to={"/billing/" + item._id}>
                  <Icon icon="money"/>
                </Link>
              </td>
            )
          } else return null;
        }
        const renderShippingButton = () => {
          if (tools.isReadAllowed("shipping") && item.status === "active") {
            return (
              <td className="no-padding">
                <Link key={i} to={"/shipping/" + item._id}>
                  <Icon icon="transaction"  />
                </Link>
              </td>
            )
          } else return null;
        }
        return (
          <tr key={i}>
            <td>{item._id}</td>
            <td className="hide-at-700px">
              {item.proposalId + "." + (item.proposalIndex+1)}
            </td>
            <td className="table__wide">{item.clientDescription}</td>
            <td><Status status={item.status} type="contract"/></td>
            <td className="table__small-column hide-at-700px">
              {tools.format((
                tools.totalValue(item.snapshots[item.index])
              ), "currency")}
            </td>
            {renderContractButton()}
            {renderBillingButton()}
            {renderShippingButton()}
          </tr>
        )
      })
  }
  render () {
    return (
      <ErrorBoundary>
        <RedirectUser currentPage="contracts"/>
        <FilterBar
          value={this.state.filterTerm}
          onChange={this.updateFilter}/>
        <div className="database__scroll-div">
          <table className="table">
            <thead>
              <tr>
                <th>Contrato</th>
                <th className="hide-at-700px">Proposta</th>
                <th className="table__wide">Nome do Cliente</th>
                <th>Status</th>
                <th className="hide-at-700px">Valor Total do Contrato</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
      </ErrorBoundary>
    )
  }
}

export default ContractsTableWrapper = withTracker((props) => {
  Meteor.subscribe('contractsPub');
  var database = Contracts.find().fetch() || [];
  database = tools.sortObjects(database, '_id', {reverseOrder: true});

  database = database.map((contract) => {
    var index = contract.snapshots.length-1;
    if (contract.status === 'active') {
      index = contract.snapshots.findIndex((snapshot) => {
        return snapshot.active;
      })
    }
    var client = contract.snapshots[index].client;
    return {
      ...contract,
      index,
      clientDescription: client.description,
      clientRegistry: client.registry
    }
  })
  return {
    database
  }
})(ContractsTable);