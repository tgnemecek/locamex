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

  renderAccessories = () => {
    return this.props.currentlyRented.accessories.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.renting}</td>
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
      && !this.props.currentlyRented.accessories.length
      && !this.props.currentlyRented.packs.length) {
      return (
        <p className="currently-rented__title">
          Não há itens atualmente no cliente
        </p>
      )
    } else {
      return (
        <div>
          <h3 className="currently-rented__title">
            Itens no Cliente
          </h3>
          {this.props.currentlyRented.series.length ?
            <>
              <h4>Containers Fixos</h4>
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
                </tbody>
              </table>
            </>
          : null}
          {this.props.currentlyRented.packs.length ?
            <>
              <h4>Containers Desmontáveis</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Qtd.</th>
                    <th>Série</th>
                    <th className="table__wide">Modelo</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderPacks()}
                </tbody>
              </table>
            </>
          : null}
          {this.props.currentlyRented.accessories.length ?
            <>
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
                  {this.renderAccessories()}
                </tbody>
              </table>
            </>
          : null}
        </div>
      )
    }
  }
}