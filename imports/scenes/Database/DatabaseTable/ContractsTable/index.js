import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import { Clients } from '/imports/api/clients/index';
import { Contracts } from '/imports/api/contracts/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import tools from '/imports/startup/tools/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

class ContractsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDatabase: [],

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
    const toggleWindow = () => {
      this.props.toggleWindow({});
    }
    return (
      <tr>
        <th className="table__small-column">Código</th>
        <th>Nome do Cliente</th>
        <th className="table__small-column">Status</th>
        <th className="table__small-column">Valor Total do Contrato</th>
        <th className="table__small-column">
          <Link className="button--link database__table__button" to="/contract/new">+</Link>
        </th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      function translate (input) {
        if (input === 'active') return 'Ativo';
        if (input === 'inactive') return 'Inativo';
        if (input === 'cancelled') return 'Cancelado';
        if (input === 'finalized') return 'Finalizado';
        if (input === 'prorogation') return 'Em Prorrogação';
        return input;
      }
      const clientName = () => {
        for (var j = 0; j < this.props.clientsDatabase.length; j++) {
          if (this.props.clientsDatabase[j]._id === item.clientId) {
            return this.props.clientsDatabase[j].description;
          }
        }
      }
      const totalValue = () => {
        var duration = item.dates.duration;
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
      return (
        <tr key={i}>
          <td className="table__small-column">{item._id}</td>
          <td>{clientName()}</td>
          <td className="table__small-column">{translate(item.status)}</td>
          <td className="table__small-column">{totalValue()}</td>
          <td className="table__small-column">
            <Link
              className="button--link database__table__button"
              key={i}
              to={"/contract/" + item._id}>✎</Link>
          </td>
          <td className="table__small-column">
            <Link
              className="button--link database__table__button"
              key={i}
              to={"/shipping/" + item._id}>⟳</Link>
          </td>
        </tr>
      )
    })
  }
  render () {
    if (this.props.ready) {
      return (
        <ErrorBoundary>
          <SearchBar
            database={this.props.fullDatabase}
            searchHere={['_id']}
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
  var fullDatabase = Contracts.find().fetch();
  var clientsDatabase = Clients.find().fetch();
  var ready = !!fullDatabase.length;
  return {
    fullDatabase,
    clientsDatabase,
    ready
  }
})(ContractsTable);