import React from 'react';
import { Link } from 'react-router-dom';
import { Clients } from '/imports/api/clients/index';
import { Contracts } from '/imports/api/contracts/index';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import SearchBar from '/imports/components/SearchBar/index';
import tools from '/imports/startup/tools/index';
import Loading from '/imports/components/Loading/index';
import NotFound from '/imports/components/NotFound/index';

export default class ContractsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullDatabase: [],
      filteredDatabase: [],
      clientsDb: [],
      ready: 0
    }
  }
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      Meteor.subscribe('contractsPub');
      var clientsDb = Clients.find({ visible: true }).fetch();
      var fullDatabase = Contracts.find({ visible: true }).fetch();
      var filteredDatabase = fullDatabase;
      if (fullDatabase) this.setState({ fullDatabase, filteredDatabase, clientsDb, ready: 1 });
    })
  }

  componentWillUnmount = () => {
    this.tracker.stop();
  }

  searchReturn = (filteredDatabase) => {
    if (filteredDatabase) {
      this.setState({ filteredDatabase });
    } else this.setState({ filteredDatabase: this.state.fullDatabase });
  }
  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th className="small-column">Código</th>
        <th>Nome da Empresa</th>
        <th className="small-column">Status</th>
        <th className="small-column">Valor Total do Contrato</th>
        <th className="small-column">
          <Link className="button--link database__table__button" to="/contract/new">+</Link>
        </th>
      </tr>
    )
  }
  renderBody = () => {
    return this.state.filteredDatabase.map((item, i) => {
      var clientName;
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      function translate (input) {
        if (input === 'active') return 'Ativo';
        if (input === 'inactive') return 'Inativo';
        if (input === 'cancelled') return 'Cancelado';
        return input;
      }
      var clientName = () => {
        for (var j = 0; j < this.state.clientsDb.length; j++) {
          if (this.state.clientsDb[j]._id === item.clientId) {
            return this.state.clientsDb[j].description;
          }
        }
      }
      var totalValue = () => {
        var arr = item.containers.concat(item.accessories, item.services);
        if (arr.length == 0) return "-";
        return tools.format(arr.reduce((acc, current) => {
          return {
              price: acc.price + current.price
          }
        }).price, "currency");
      }
      return (
        <tr key={i}>
          <td className="small-column">{item._id}</td>
          <td>{clientName()}</td>
          <td className="small-column">{translate(item.status)}</td>
          <td className="small-column">{totalValue()}</td>
          <td className="small-column">
            <Link
              className="button--link database__table__button"
              key={i}
              to={"/contract/" + item._id}>✎</Link>
            {/* <button className="database__table__button" onClick={toggleWindow}>✎</button> */}
          </td>
        </tr>
      )
    })
  }
  render () {
    if (this.state.ready === 1) {
      return (
        <ErrorBoundary>
          <SearchBar
            database={this.state.fullDatabase}
            options={this.searchOptions}
            searchReturn={this.searchReturn}
          />
          <table className="table database__table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </ErrorBoundary>
      )
    } else if (this.state.ready === 0) {
      return <Loading/>
    } else if (this.state.ready === -1) {
      return <NotFound/>
    }
  }
}