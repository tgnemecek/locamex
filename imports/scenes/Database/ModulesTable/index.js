import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import RegisterModules from '/imports/components/RegisterModules/index';

export default class ModulesTable extends React.Component {
  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th className="small-column">Código</th>
        <th>Descrição</th>
        <th className="small-column">Disponíveis</th>
        <th className="small-column">Locados</th>
        <th className="small-column">Manutenção</th>
        <th className="small-column">Total</th>
        <th className="small-column"><button onClick={toggleWindow} className="database__table__button">+</button></th>
      </tr>
    )
  }
  renderBody = () => {
    return this.props.database.map((item, i) => {
      const toggleWindow = () => {
        this.props.toggleWindow(item);
      }
      return (
        <tr key={i}>
          <td className="small-column">{item._id}</td>
          <td>{item.description}</td>
          <td className="small-column">{item.available}</td>
          <td className="small-column">{item.rented}</td>
          <td className="small-column">{item.maintenance}</td>
          <td className="small-column">{(item.available + item.rented + item.maintenance).toString()}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
        </tr>
      )
    })
  }
  render () {
    return (
      <ErrorBoundary>
        <table className="table database__table database__table--clients">
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
        {this.props.item ?
          <RegisterModules
            item={this.props.item}
            toggleWindow={this.props.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}