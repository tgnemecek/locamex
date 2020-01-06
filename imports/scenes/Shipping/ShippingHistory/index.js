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
    item.list = prepareList(item, this.props.placesDatabase);
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

  renderBody = () => {
    if (!this.props.contract.shipping) return null;
    function translateType(type) {
      if (type === 'send') return "Entrega";
      if (type === 'receive') return "Devolução";
      return "";
    }
    function renderList(item, placesDatabase) {
      var list = prepareList(item, placesDatabase);
      return list.map((item, i) => {
        return (
          <li key={i}>
            {`${item.quantity}x ${item.description}`}
          </li>
        )
      })
    }
    return this.props.contract.shipping.reverse().map((item, i) => {
      return (
        <tr key={i}>
          <td>{moment(item.date).format("DD-MMMM-YYYY")}</td>
          <td>{translateType(item.type)}</td>
          <td>
            <ul>
              {renderList(item, this.props.placesDatabase)}
            </ul>
        </td>
          <td className="table__small-column">
            <button onClick={() => this.printDocument(i)}>
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

function prepareList(item, placesDatabase) {
  if (!item || !placesDatabase) return [];
  var fixed = item.fixed ? item.fixed.map((item) => {
    return {
      quantity: 1,
      description: `${item.description} (Série: ${item.seriesId})`
    }
  }) : null;
  var accessories = [];
  item.accessories ? item.accessories.forEach((item) => {
    if (Array.isArray(item.selected)) {
      var quantity;
      var description;
      item.selected.forEach((selected) => {
        var place = placesDatabase.find((place) => {
          return place._id === selected.place;
        });
        place = place ? place.description : "";
        quantity = selected.selected;
        description = item.description + " (Pátio: " + place + ")";
      })
    } else {
      quantity = item.selected;
      description = item.description;
    }
    accessories.push({
      quantity,
      description
    })
  }) : null;
  var modules = [];
  item.modules ? item.modules.forEach((item) => {
    if (Array.isArray(item.selected)) {
      var quantity;
      var description;
      item.selected.forEach((selected) => {
        var place = placesDatabase.find((place) => {
          return place._id === selected.place;
        });
        place = place ? place.description : "";
        quantity = selected.selected,
        description = item.description + " (Pátio: " + place + ")"
      })
    } else {
     quantity = item.selected;
     description = item.description;
    }
    modules.push({
      quantity,
      description
    })
  }) : null;
  return fixed.concat(accessories, modules);
}