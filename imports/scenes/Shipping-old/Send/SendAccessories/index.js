import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import SelectAccessories from './SelectAccessories/index';

export default class SendAccessories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectMultiple: {
        isOpen: false,
        item: {},
        title: ""
      }
    }
  }

  renderHeader = () => {
    return (
      <tr>
        <th className="table__small-column">#</th>
        <th>Produto</th>
        <th className="table__small-column">Quantidade</th>
        <th className="table__small-column">Seleção</th>
      </tr>
    )
  }

  toggleMultipleWindow = (e) => {
    if (!e) return this.setState({ selectMultiple: { isOpen: false } });
    var index = e.target.value;
    var _id = this.props.accessories[index]._id;
    var productId = this.props.accessories[index].productId;
    if (!productId) return;
    var item = this.props.accessories[index];
    var selectMultiple = {
      isOpen: true,
      item: item,
      title: "Produto: " + item.description
    }
    this.setState({ selectMultiple });
  }

  renderBody = () => {
    function countSelection(item) {
      return item.selected.reduce((acc, cur) => {
        return acc + cur.selected
      }, 0);
    }
    function checkmark(item) {
      if (countSelection(item) > 0) {
        return <span style={{color: 'green'}}>✔</span>;
      } else return <span style={{color: 'red'}}>⦸</span>;
    }

    return this.props.accessories.map((item, i) => {
      return (
        <tr key={i}>
          <td className="table__small-column">{i+1}</td>
          <td>{item.description}</td>
          <td className="table__small-column">{item.quantity}</td>
          <td className="table__small-column">{countSelection(item)}</td>
          <td className="table__small-column"><button className="database__table__button" value={i} onClick={this.toggleMultipleWindow}>⟳</button></td>
          <td className="table__small-column">
            {checkmark(item)}
          </td>
        </tr>
      )
    });
  }

  onChange = (changedItem) => {
    var accessories = [...this.props.accessories];
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
          {this.state.selectMultiple.isOpen ?
            <SelectAccessories
              onChange={this.onChange}
              item={this.state.selectMultiple.item}
              title={this.state.selectMultiple.title}
              toggleWindow={this.toggleMultipleWindow}
              productFromDatabase={tools.findUsingId(this.props.accessoriesDatabase, this.state.selectMultiple.item.productId)}
              placesDatabase={this.props.placesDatabase}

            />
          : null}
        </Block>
      )
    } else return null;
  }
}