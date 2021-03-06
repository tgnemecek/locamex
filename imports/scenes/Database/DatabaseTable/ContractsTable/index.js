import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Clients } from '/imports/api/clients/index';
import { Contracts } from '/imports/api/contracts/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';
import Status from '/imports/components/Status/index';

class ContractsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: []
    }
  }

  componentDidMount() {
    this.setState({ filteredDatabase: this.props.fullDatabase });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ filteredDatabase: this.props.fullDatabase });
    }
  }

  filterSearch = (filteredDatabase) => {
    this.setState({ filteredDatabase });
  }
  renderHeader = () => {
    return (
      <tr>
        <th className="table__small-column">Contrato</th>
        <th className="table__small-column hide-at-700px">Proposta</th>
        <th>Nome do Cliente</th>
        <th className="table__small-column">Status</th>
        <th className="table__small-column hide-at-700px">Valor Total do Contrato</th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      const clientName = () => {
        for (var j = 0; j < this.props.clientsDatabase.length; j++) {
          if (this.props.clientsDatabase[j]._id === item.clientId) {
            return this.props.clientsDatabase[j].description;
          }
        }
      }
      const totalValue = () => {
        var duration = item.dates.timeUnit === "months" ? item.dates.duration : 1;
        var discount = item.discount;

        var containers = item.containers || [];
        var accessories = item.accessories || [];
        var products = containers.concat(accessories);
        var productsValue = products.reduce((acc, current) => {
          var renting = current.renting || 1;
          return acc + (current.price * renting * duration)
        }, 0);
        productsValue = productsValue * (1 - discount);

        var services = item.services || [];
        var servicesValue = services.reduce((acc, current) => {
          var renting = current.renting ? current.renting : 1;
          return acc + (current.price * renting)
        }, 0);

        return tools.format((productsValue + servicesValue), "currency");
      }
      const renderContractButton = () => {
        if (tools.isUserAllowed("contract")) {
          return (
            <td className="table__small-column">
              <Link key={i} to={"/contract/" + item._id}>
                <Icon icon="edit"/>
              </Link>
            </td>
          )
        } else return null;
      }
      const renderBillingButton = () => {
        if (tools.isUserAllowed("billing") && item.status === "active") {
          return (
            <td className="table__small-column">
              <Link key={i} to={"/billing/" + item._id}>
                <Icon icon="money"/>
              </Link>
            </td>
          )
        } else return null;
      }
      const renderShippingButton = () => {
        if (tools.isUserAllowed("shipping") && item.status === "active") {
          return (
            <td className="table__small-column">
              <Link key={i} to={"/shipping/" + item._id}>
                <Icon icon="transaction"  />
              </Link>
            </td>
          )
        } else return null;
      }
      return (
        <tr key={i}>
          <td className="table__small-column">{item._id}</td>
          <td className="table__small-column hide-at-700px">
            {`${item.proposal}.${Number(item.proposalVersion)+1}`}
          </td>
          <td>{clientName()}</td>
          <td className="table__small-column"><Status status={item.status} type="contract"/></td>
          <td className="table__small-column hide-at-700px">{totalValue()}</td>
          {renderContractButton()}
          {renderBillingButton()}
          {renderShippingButton()}
        </tr>
      )
    })
  }
  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <RedirectUser currentPage="contracts"/>
          <SearchBar
            database={this.props.fullDatabase}
            searchHere={['_id', 'officialName', 'description', 'registry', 'proposal']}
            filterSearch={this.filterSearch}
          />
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

export default ContractsTableWrapper = withTracker((props) => {
  Meteor.subscribe('clientsPub');
  Meteor.subscribe('contractsPub');
  Meteor.subscribe('usersPub');
  var fullDatabase = Contracts.find().fetch();
  var clientsDatabase = Clients.find().fetch();

  fullDatabase = tools.sortObjects(fullDatabase, '_id', {reverseOrder: true});
  fullDatabase = fullDatabase.map((item) => {
    var newItem = tools.explodeContract(item);
    var currentClient = clientsDatabase.find((client) => {
      return client._id === newItem.clientId
    });

    if (currentClient) {
      newItem.registry = currentClient.registry;
      newItem.officialName = currentClient.officialName;
      newItem.description = currentClient.description;
    }
    return newItem;
  })
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    clientsDatabase,
    ready
  }
})(ContractsTable);