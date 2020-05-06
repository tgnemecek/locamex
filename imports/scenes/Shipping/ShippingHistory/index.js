import React from 'react';
import moment from 'moment';
import { saveAs } from 'file-saver';
import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import PackInspector from './PackInspector/index';

export default class ShippingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packToInspect: false,
      databaseStatus: false
    }
  }
  togglePackInspector = (packToInspect) => {
    if (this.state.packToInspect) {
      this.setState({ packToInspect: false })
    } else {
      this.setState({ packToInspect })
    }
  }
  shippingSeries = (shipping) => {
    return shipping.series.map((series, i) => {
      return (
        <tr key={i}>
          <td>1</td>
          <td>
            {series.container.description}
          </td>
          <td>{series.description}</td>
          <td>{series.place.description}</td>
        </tr>
      )
    })
  }
  shippingPacks = (shipping) => {
    return shipping.packs.map((pack, i) => {
      var place;
      if (typeof pack.place === 'object') {
        place = pack.place.description;
      } else {
        var singlePlace = true;
        pack.modules.forEach((module) => {
          module.places.forEach((places) => {
            if (place && place !== places.description) {
              singlePlace = false;
            } else {
              place = places.description;
            }
          })
        })
        if (!singlePlace) {
          place = "Múltiplos Pátios"
        }
      }

      var placeStyle = {
        paddingTop: "0",
        paddingRight: "0",
        paddingBottom: "0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
      }

      return (
        <tr key={i}>
          <td>1</td>
          <td>
            {pack.container.description}
          </td>
          <td>{pack.description}</td>
          <td style={placeStyle}>
            {place}
            <div>
              <button onClick={() => this.togglePackInspector(pack)}>
                <Icon icon="search"/>
              </button>
            </div>

          </td>
        </tr>
      )
    })
  }
  shippingVariations = (shipping) => {
    return shipping.variations.map((variation, i) => {
      var quantity = variation.places.reduce((acc, item) => {
        return acc + item.quantity
      }, 0);

      var places;
      if (variation.places.length === 1) {
        places = variation.places[0].description;
      } else {
        places = variation.places.map((place, i) => {
          return (
            <div key={i}>
              {place.description
                + " (" + place.quantity + ")"}
            </div>
          )
        })
      }
      return (
        <tr key={i}>
          <td>{quantity}</td>
          <td>
            {variation.accessory.description}
          </td>
          <td>{variation.description}</td>
          <td>{places}</td>
        </tr>
      )
    })
  }
  generateDocument = (invertedIndex) => {
    var item = this.shipping()[invertedIndex];
    item.index = this.props.shipping.findIndex((shipping) => {
      return shipping === item;
    })
    item.contractId = this.props.contractId;

    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('pdf.generate', item, (err, res) => {
        if (res) {
          saveAs(res.data, res.fileName);
          this.setState({ databaseStatus: "completed" });
        }
        if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      })
    })
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
          <td>
            {moment(shipping.date).format("DD-MM-YYYY")}
          </td>
          <td style={{borderRight: "none"}}>
            {shipping.type === "send" ? "Envio" : "Devolução"}
          </td>
          <td className="no-padding" style={{border: "none"}}>
            <table className="table shipping-history__sub-table">
              <tbody>
                {this.shippingSeries(shipping)}
                {this.shippingPacks(shipping)}
                {this.shippingVariations(shipping)}
              </tbody>
            </table>
          </td>
          <td className="no-padding shipping-history__button-cell">
            <button onClick={() => this.generateDocument(i)}>
              <Icon icon="print"/>
            </button>
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
          <div className="shipping-history__scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th style={{borderRight: "none"}}>Tipo</th>
                  <th className="no-padding" style={{border: "none"}}>
                    <table className="table shipping-history__sub-table">
                      <thead>
                        <tr>
                          <th>Qtd.</th>
                          <th>
                            Produto
                          </th>
                          <th>Série/Variação</th>
                          <th>Origem/Destino</th>
                        </tr>
                      </thead>
                    </table>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
          {this.state.packToInspect ?
            <PackInspector
              hasBox={true}
              toggleWindow={this.togglePackInspector}
              pack={this.state.packToInspect}/>
          : null}
          <DatabaseStatus status={this.state.databaseStatus}/>
        </div>
      )
    }
  }
}