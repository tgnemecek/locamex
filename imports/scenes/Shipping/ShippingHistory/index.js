import React from 'react';
import moment from 'moment';
import { saveAs } from 'file-saver';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class ShippingHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      databaseStatus: ''
    }
  }

  renderHeader = () => {
    return (
      <thead>
        <tr>
          <th className="table__small-column">#</th>
          <th>Data do Registro</th>
          <th>Tipo de Remessa</th>
          <th>Itens</th>
        </tr>
      </thead>
    )
  }

  printDocument = (index) => {
    var item = this.props.contract.shipping[index];
    item.list = this.props.prepareList(item, true);
    item.contractId = this.props.contract._id;
    item.index = index;

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

  prepareList = (item, showPlace) => {
    if (!item || !this.props.placesDatabase) return [];
    var fixed = item.fixed ? item.fixed.map((item) => {
      var place = "";
      if (showPlace) {
        var place = this.props.placesDatabase.find((p) => {
          return item.place === p._id;
        });
        place = place ? `(Pátio: ${place.description} ` : "";
      }
      return {
        quantity: 1,
        description: `${item.description} ${place}- Série: ${item.seriesId})`
      }
    }) : null;
    var accessories = [];
    item.accessories ? item.accessories.forEach((item) => {
      var quantity;
      var description;
      item.selected.forEach((selected) => {
        var placeDescription = "";
        if (showPlace) {
          this.props.placesDatabase.forEach((place) => {
            if (place._id === selected.place) {
              placeDescription = "Pátio: " + place.description
            }
          });
        }

        var variationDescription = "";
        this.props.accessoriesDatabase.forEach((product) => {
          if (product._id === item.productId) {
            if (product.variations.length > 1) {
              variationDescription =
                " - Padrão: " +
                tools.convertToLetter(selected.variationIndex);
            }
          }
        })
        quantity = selected.selected;
        description = item.description + " (" +
          placeDescription +
          variationDescription + ")";
        accessories.push({
          quantity,
          description
        })
      })
    }) : null;
    var modules = [];
    item.modules ? item.modules.forEach((item) => {
      var quantity;
      var description;
      item.selected.forEach((selected) => {
        var place = "";
        if (showPlace) {
          place = this.props.placesDatabase.find((place) => {
            return place._id === selected.place;
          });
          place = place ? ` (Pátio: ${place.description})` : "";
        }
        quantity = selected.selected,
        description = item.description + place;
        modules.push({
          quantity,
          description
        })
      })
    }) : null;
    return fixed.concat(accessories, modules);
  }

  renderBody = () => {
    if (!this.props.contract.shipping) return null;
    function translateType(type) {
      if (type === 'send') return "Envio";
      if (type === 'receive') return "Recebimento";
      return "";
    }
    const renderList = (item) => {
      var list = this.prepareList(item, true);
      return list.map((item, i) => {
        return (
          <li key={i}>
            {`${item.quantity}x ${item.description}`}
          </li>
        )
      })
    }
    var shipping = tools.deepCopy(this.props.contract.shipping);
    shipping.reverse();
    return shipping.map((item, i, arr) => {
      return (
        <tr key={i}>
          <td>{arr.length - i}</td>
          <td>{moment(item.date).format("DD-MMMM-YYYY HH:MM")}</td>
          <td>{translateType(item.type)}</td>
          <td>
            <ul>
              {renderList(item)}
            </ul>
        </td>
          <td className="table__small-column">
            <button onClick={() => this.printDocument(arr.length - i - 1)}>
              <Icon icon="print"/>
            </button>
          </td>
        </tr>
      )
    })
  }

  renderFooter = () => {
    if (this.props.contract.shipping) {
      if (this.props.contract.shipping.length) return null;
    }
    return (
      <tfoot>
        <tr>
          <td colSpan="3">
            Não foram encontrados registros neste contrato
          </td>
        </tr>
      </tfoot>
    )
  }

  render() {
    return (
      <>
        <table className="table">
          {this.renderHeader()}
          <tbody>
            {this.renderBody()}
          </tbody>
          {this.renderFooter()}
        </table>
        <DatabaseStatus status={this.state.databaseStatus}/>
      </>

    )
  }
}