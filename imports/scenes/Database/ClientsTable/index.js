import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import RegisterServices from '/imports/components/RegisterServices/index';

export default class ClientsTable extends React.Component {
  renderHeader = () => {
    const toggleWindow = () => {
      this.props.toggleWindow();
    }
    return (
      <tr>
        <th className="small-column">Código</th>
        <th>Nome Fantasia</th>
        <th className="small-column">Tipo</th>
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
          <td className="small-column">{item.type === 'company' ? "PJ" : "PF"}</td>
          <td className="small-column"><button className="database__table__button" onClick={toggleWindow}>✎</button></td>
        </tr>
      )
    })
  }
  render () {
    return (
      <ErrorBoundary>
        <table className="database__table database__table--clients">
          <thead>
            {this.renderHeader()}
          </thead>
          <tbody>
            {this.renderBody()}
          </tbody>
        </table>
        {this.props.item ?
          <RegisterServices
            item={this.props.item}
            toggleWindow={this.props.toggleWindow}
          />
        : null}
      </ErrorBoundary>
    )
  }
}