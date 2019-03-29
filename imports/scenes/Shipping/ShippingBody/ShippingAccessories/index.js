import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

export default class ShippingAccessories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMultiple: false,
      itemToSelect: {}
    }
  }

  renderHeader = () => {
    return (
      <tr>
        <th>#</th>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Seleção</th>
      </tr>
    )
  }

  toggleMultipleWindow = (e) => {
    var index = e ? e.target.value : null;
    var itemToSelect = this.state.selectMultiple ? false : this.props.accessories[index];
    this.setState({ selectMultiple: !this.state.selectMultiple, itemToSelect });
  }

  renderBody = () => {
    function check(item) {
      if (!item.selectedList) return false;
      var currentlySelected = item.selectedList.reduce((acc, cur) => {
        return acc + cur.selected
      }, 0);
      return currentlySelected === item.renting;
    }

    return this.props.accessories.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{item.description}</td>
          <td>{item.renting}</td>
          <td><button className="database__table__button" value={i} onClick={this.toggleMultipleWindow}>⟳</button></td>
          <td className="table__small-column">
            {check(item) ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>⦸</span>}
          </td>
        </tr>
      )
    });
  }

  onChange = (changedItem) => {
    var accessories = tools.deepCopy(this.props.accessories);
    var itemIndex = accessories.findIndex((element) => {
      return element._id === changedItem._id;
    })
    accessories[itemIndex] = {
      ...accessories[itemIndex],
      ...changedItem
    };
    this.props.onChange({ accessories });
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
          {this.state.selectMultiple && this.state.itemToSelect ?
            <this.props.SelectMultiple
              onChange={this.onChange}
              productFromDatabase={tools.findUsingId(this.props.accessoriesDatabase, this.state.itemToSelect._id)}
              placesDatabase={this.props.placesDatabase}
              toggleWindow={this.toggleMultipleWindow}
              item={this.state.itemToSelect}
            />
          : null}
        </Block>
      )
    } else return null;
  }
}