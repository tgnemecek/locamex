import ReactModal from 'react-modal';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.className = "database__table " + "database__table--" + this.props.type;
  }
  renderEdit = (item) => {
    var toggleWindow = () => {
      this.props.toggleWindow(item);
    }
    return <button className="database__table__button" onClick={toggleWindow}>✎</button>
  }
  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    switch (this.props.type) {
      case 'accessories':
        return (
          <tr>
            <th className="column-0">Código</th>
            <th className="column-1">Descrição</th>
            <th className="column-2">Disponíveis</th>
            <th className="column-3">Locados</th>
            <th className="column-4">Manutenção</th>
            <th className="column-5">Total</th>
            <th className="column-6">Valor</th>
            <th className="column-7"><button onClick={toggleWindow} className="database__table__button">+</button></th>
          </tr>
        )
      case 'clients':
        return (
          <tr>
            <th className="column-0">Código</th>
            <th className="column-1">Nome Fantasia</th>
            <th className="column-2">Tipo</th>
            <th className="column-3"><button onClick={toggleWindow} className="database__table__button">+</button></th>
          </tr>
        )
      case 'services':
        return (
          <tr>
            <th className="column-0">Código</th>
            <th className="column-1">Descrição</th>
            <th className="column-2">Valor</th>
            <th className="column-3"><button onClick={toggleWindow} className="database__table__button">+</button></th>
          </tr>
        )
      default:
        return null
    }
  }
  renderBody = () => {
    switch (this.props.type) {
      case 'accessories':
        return this.props.database.map((item, i) => {
          return (
            <tr key={i}>
              <td className="column-0">{item._id}</td>
              <td className="column-1">{item.description}</td>
              <td className="column-2">{item.available}</td>
              <td className="column-3">{item.rented}</td>
              <td className="column-4">{item.maintenance}</td>
              <td className="column-5">{item.available + item.rented + item.maintenance}</td>
              <td className="column-6">{tools.format(item.price, 'currency')}</td>
              <td className="column-7">{this.renderEdit(item)}</td>
            </tr>
          )
        })
      case 'clients':
        return this.props.database.map((item, i) => {
          return (
            <tr key={i}>
              <td className="column-0">{item._id}</td>
              <td className="column-1">{item.description}</td>
              <td className="column-2">{item.type === 'company' ? "PJ" : "PF"}</td>
              <td className="column-3">{this.renderEdit(item)}</td>
            </tr>
          )
        })
      case 'services':
        return this.props.database.map((item, i) => {
          return (
            <tr key={i}>
              <td className="column-0">{item._id}</td>
              <td className="column-1">{item.description}</td>
              <td className="column-2">{tools.format(item.price, 'currency')}</td>
              <td className="column-3">{this.renderEdit(item)}</td>
            </tr>
          )
        })
      default:
        return null
    }
  }
  render () {
    return (
      <ErrorBoundary>
        <table className={this.className}>
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