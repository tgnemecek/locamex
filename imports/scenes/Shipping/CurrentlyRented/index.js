import React from 'react';
import moment from 'moment';
import { saveAs } from 'file-saver';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class CurrentlyRented extends React.Component {
  renderBody = () => {
    var all = [].concat(
      this.props.currentlyRented.fixed.map((item) => {
        return {...item, type: "fixed"}
      }),
      this.props.currentlyRented.accessories.map((item) => {
        return {...item, type: "accessory"}
      }),
      this.props.currentlyRented.packs.map((item) => {
        return {...item, type: "pack"}
      })
    )
    function extras(item) {
      var series = item.series ? "Série: " + item.series : "";
      var place = item.place ? "Pátio: " + item.place : "";
      var variation = item.variation || "";
      var label = item.label ? "Etiqueta " + item.label : "";
      var array = [series, place, variation, label];
      array = array.filter((str) => str);
      if (array.length) {
        return "(" + array.join(" - ") + ")";
      } else return "";
    }
    return (
      <tr>
        <td>
          <ul>
            {this.props.prepareList(this.props.currentlyRented).map((obj, i) => {
              return (
                <li key={i}>
                  {`${obj.quantity}x ${obj.description} ${extras(obj)}`}
                  {obj.subList ?
                    <ul>
                      {obj.subList.map((subItem, i) => {
                        return (
                          <li key={i}>
                            {`${subItem.quantity}x ${subItem.description} ${extras(subItem)}`}
                          </li>
                        )
                      })}
                    </ul>
                  : null}
                </li>
              )
            })}
          </ul>
        </td>
      </tr>
    )
    // return all.map((item, i) => {
    //   return (
    //     <tr key={i}>
    //       <td>{this.props.prepareList(item)}</td>
    //     </tr>
    //   )
    // });
  }

  render() {
    if (!this.props.currentlyRented.fixed.length &&
        !this.props.currentlyRented.accessories.length &&
        !this.props.currentlyRented.packs.length) {
      return (
        <p style={{fontStyle: "italic", textAlign: "center"}}>
          Não há itens atualmente no cliente.
        </p>
      )
    }
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Itens</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    )
  }
}