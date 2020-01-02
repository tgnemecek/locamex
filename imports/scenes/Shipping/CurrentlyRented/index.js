import React from 'react';
import moment from 'moment';
import { saveAs } from 'file-saver';

import tools from '/imports/startup/tools/index';
import Icon from '/imports/components/Icon/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

export default class CurrentlyRented extends React.Component {

  renderBody = () => {
    var currentlyRented = [];

    const isItemIncluded = (itemId) => {
      var found = currentlyRented.find((item) => {
        return item._id === itemId;
      })
      return found;
    }

    const processArray = (registry, type) => {
      if (type === "fixed") {
        if (registry.type === "send") {
          if (!isItemIncluded(item._id)) {
            currentlyRented.push(item);
          }
        } else if (registry.type === "receive") {
          for (var i = 0; i < currentlyRented.length; i++) {
            if (currentlyRented[i]._id === item._id) {
              currentlyRented.splice(i, 1);
              break;
            }
          }
        }
      } else {
        // var found = isItemIncluded(item._id);
        // if (!found) {
        //   currentlyRented.push(item);
        // } else {
        //   var renting = registry.type === "send" ? item.renting : -item.renting;
        //   found.renting += renting;
        // }
      }
    }

    this.props.contract.shipping.forEach((registry) => {
      processArray(registry, "fixed");
      processArray(registry, "accessories");
      processArray(registry, "modules");
    })



    return currentlyRented.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{item.renting}</td>
          <td>{item.description}</td>
        </tr>
      )
    });
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th className="table__small-column">#</th>
            <th className="table__small-column">Quantidade</th>
            <th>Item</th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    )
  }
}