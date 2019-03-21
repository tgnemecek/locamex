import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class ShippingAccessories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMultiple: false
    }
  }

  renderHeader = () => {
    return (
      <tr>
        <th>#</th>
        <th>Produto</th>
        <th>Seleção</th>
      </tr>
    )
  }

  toggleMultipleWindow = (e) => {
    var index = e ? e.target.value : null;
    var selectMultiple = this.state.selectMultiple ? false : {...this.props.accessories[index]};
    this.setState({ selectMultiple });
  }

  getDescriptionPlace = (placeId) => {
    var place = this.props.placesDatabase.find((item) => {
      return item._id === placeId;
    });
    return place ? place.description : null;
  }

  getDescriptionModel = (model) => {
    var container = this.props.containersDatabase.find((item) => {
      return item._id === model;
    });
    return container ? container.description : null;
  }

  renderBody = () => {
    function check(item) {
      if (!item.selected) return false;
      var currentlySelected = item.selected.reduce((acc, cur) => {
        return acc + cur.renting
      }, 0);
      return currentlySelected === item.renting;
    }

    return this.props.accessories.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{item.description}</td>
          <td><button className="database__table__button" value={i} onClick={this.toggleMultipleWindow}>⟳</button></td>
          <td className="table__small-column">
            {check(item) ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>✖</span>}
          </td>
        </tr>
      )
    });
  }

  render() {
    if (this.props.accessories.length > 0) {
      return (
        <Block columns={1} title="Acessórios">
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.state.selectMultiple ?
            <this.props.SelectMultiple
              toggleWindow={this.toggleMultipleWindow}
              item={this.state.selectMultiple}
            />
          : null}
        </Block>
      )
    } else return null;
  }
}