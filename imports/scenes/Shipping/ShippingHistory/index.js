import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default class ShippingHistory extends React.Component {
  renderBody = () => {
    return this.props.shipping.map((shipping, i) => {
      return (
        <tr key={i}>
          <td>{moment(shipping.date).format("DD-MM-YYYY")}</td>
          <td>{shipping.type === "send" ? "Envio" : "Devolução"}</td>
          <td className="table__wide">
            <ul>
              {shipping.series.map((series, i) => {
                return (
                  <li key={i}>
                    {
                      series.container.description +
                      "(Série: "+series.description + ". Origem: " +
                      series.place.description+")"
                    }
                  </li>
                )
              })}
              {shipping.packs.map((pack, i) => {
                // var place = typeof pack.place === 'object' ?
                //               pack.place
                return (
                  <li key={i}>
                    {
                      pack.container.description +
                      "(Série: "+pack.description + ". Origem: " +
                      pack.place.description+")"
                    }
                  </li>
                )
              })}
            </ul>
          </td>
        </tr>
      )
    })
  }

  render() {
    if (!this.props.shipping.length) {
      return (
        <p className="currently-rented__title">
          Nenhum envio realizado
        </p>
      )
    } else {
      return (
        <div>
          <h3 className="currently-rented__title">
            Histórico de Remessas
          </h3>
          <table className="table">
            {/* <thead>
              <tr>
                <th>Qtd.</th>
                <th>Série</th>
                <th className="table__wide">Modelo</th>
              </tr>
            </thead> */}
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
      )
    }
  }
}