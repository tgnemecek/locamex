import React from 'react';

import tools from '/imports/startup/tools/index';

export default class CurrentlyRented extends React.Component {
  renderSeries = () => {
    return this.props.currentlyRented.series.map((item, i) => {
      return (
        <tr key={i}>
          <td>1</td>
          <td>{item.description}</td>
          <td className="table__wide">
            {item.container.description}
          </td>
        </tr>
      )
    })
  }

  renderPacks = () => {
    return this.props.currentlyRented.packs.map((item, i) => {
      return (
        <tr key={i}>
          <td>1</td>
          <td>{item.description}</td>
          <td className="table__wide">
            {item.container.description}
          </td>
        </tr>
      )
    })
  }

  renderVariations = () => {
    return this.props.currentlyRented.variations
    .map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.quantity}</td>
          <td>{item.accessory.description}</td>
          <td className="table__wide">
            {item.description}
          </td>
        </tr>
      )
    })
  }

  render() {
    if (!this.props.currentlyRented.series.length
      && !this.props.currentlyRented.variations.length
      && !this.props.currentlyRented.packs.length) {
      return (
        <p className="shipping__title">
          Não há itens atualmente no cliente
        </p>
      )
    } else {
      return (
        <div>
          <h3 className="shipping__title">
            Itens no Cliente
          </h3>
          <div
            className="shipping-rented__scroll">
            <div>
              <h4>Containers</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Qtd.</th>
                    <th>Série</th>
                    <th className="table__wide">Modelo</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderSeries()}
                  {this.renderPacks()}
                </tbody>
              </table>
            </div>
            <div>
              <h4>Acessórios</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Qtd.</th>
                    <th>Descrição</th>
                    <th className="table__wide">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderVariations()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  }
}