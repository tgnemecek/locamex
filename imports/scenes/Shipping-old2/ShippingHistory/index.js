import React from 'react';
import moment from 'moment';
import tools from '/imports/startup/tools/index';

export default class ShippingHistory extends React.Component {
  shippingSeries = (shipping) => {
    return shipping.series.map((series, i) => {
      return (
        <li key={i}>
          {
            series.container.description +
            " (Série: "+series.description + ". " +
            series.place.description+")"
          }
        </li>
      )
    })
  }
  shippingPacks = (shipping) => {
    return shipping.packs.map((pack, i) => {
      var place;
      if (typeof pack.place === 'object') {
        place = ". " +
          pack.place.description
      } else place = "";

      return (
        <li key={i}>
          {
            pack.container.description +
            " (Série: "+pack.description + place + ")"
          }
        </li>
      )
    })
  }
  shippingAccessories = (shipping) => {
    var result = [];
    shipping.accessories.forEach((accessory) => {
      accessory.variations.forEach((variation, i) => {
        var placeQuantity = "";
        variation.from.forEach((place, j) => {
          if (j !== 0) placeQuantity += ", ";
          placeQuantity += place.quantity + "x ";
          placeQuantity += place.description;
        })
        result.push(
          <li key={i}>
            {
              accessory.description +
              " (" +
              variation.description + ". " +
              placeQuantity + ")"
            }
          </li>
        )
      })
    })
    return result;
  }
  shipping = () => {
    var shippingInverted = [];
    for (
      var i = this.props.shipping.length-1;
      i >= 0; i--) {
      shippingInverted.push(this.props.shipping[i]);
    }
    return shippingInverted;
  }
  renderBody = () => {
    return this.shipping().map((shipping, i) => {
      return (
        <tr key={i}>
          <td>{moment(shipping.date).format("DD-MM-YYYY")}</td>
          <td>{shipping.type === "send" ? "Envio" : "Devolução"}</td>
          <td className="table__wide">
            <ul>
              {this.shippingSeries(shipping)}
              {this.shippingPacks(shipping)}
              {this.shippingAccessories(shipping)}
            </ul>
          </td>
        </tr>
      )
    })
  }

  render() {
    if (!this.shipping().length) {
      return (
        <p className="shipping__title">
          Nenhum envio realizado
        </p>
      )
    } else {
      return (
        <div>
          <h3 className="shipping__title">
            Histórico de Remessas
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th className="table__wide">Produtos</th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
      )
    }
  }
}