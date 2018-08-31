import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import { Link } from 'react-router';
import { Clients } from '/imports/api/clients/index';
import tools from '/imports/startup/tools/index';

export default class ContractsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clientsDb: [] };
  }
  componentDidMount() {
    this.tracker = Tracker.autorun(() => {
      Meteor.subscribe('clientsPub');
      var clientsDb = Clients.find({ visible: true }).fetch();
      this.setState({ clientsDb });
    })
  }
  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th className="small-column">Código</th>
        <th>Nome Fantasia</th>
        <th className="small-column">Status</th>
        <th className="small-column">Valor Total do Contrato</th>
        <th className="small-column">
          <Link className="button--link database__table__button" to={"/"}>+</Link>
          {/* <button onClick={toggleWindow} className="database__table__button">+</button> */}
        </th>
      </tr>
    )
  }
  renderBody = () => {
    return this.props.database.map((item, i) => {
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
    return (
      <ErrorBoundary>
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
  }
}