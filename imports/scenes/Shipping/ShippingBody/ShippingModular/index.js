import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import SelectModules from './SelectModules/index';

export default class ShippingModular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modulesWindow: false,
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

  toggleModulesWindow = (e) => {
    var index = e ? e.target.value : null;
    var itemToSelect = this.state.modulesWindow ? false : this.props.modular[index];
    this.setState({ modulesWindow: !this.state.modulesWindow, itemToSelect });
  }

  renderBody = () => {
    function check(item) {
      if (!item.selectedList) return false;
      var currentlySelected = item.selectedList.reduce((acc, cur) => {
        return acc + cur.selected
      }, 0);
      return currentlySelected === item.renting;
    }

    return this.props.modular.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>{tools.findUsingId(this.props.containersDatabase, item._id).description}</td>
          <td>{item.renting}</td>
          <td><button className="database__table__button" value={i} onClick={this.toggleModulesWindow}>⟳</button></td>
          <td className="table__small-column">
            {check(item) ? <span style={{color: 'green'}}>✔</span> : <span style={{color: 'red'}}>✖</span>}
          </td>
        </tr>
      )
    });
  }

  onChange = (changedItem) => {
    var modular = tools.deepCopy(this.props.modular);
    var itemIndex = modular.findIndex((element) => {
      return element._id === changedItem._id;
    })
    modular[itemIndex] = {
      ...modular[itemIndex],
      ...changedItem
    };
    this.props.onChange({ modular });
  }

  render() {
    if (this.props.modular.length > 0) {
      return (
        <Block columns={1} title="Containers Modulares">
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.state.modulesWindow && this.state.itemToSelect ?
            <SelectModules
              onChange={this.onChange}
              item={this.state.itemToSelect}
              productFromDatabase={tools.findUsingId(this.props.containersDatabase, this.state.itemToSelect._id)}
              modulesDatabase={this.props.modulesDatabase}
              placesDatabase={this.props.placesDatabase}
              toggleWindow={this.toggleModulesWindow}
            />
          : null}
        </Block>
      )
    } else return null;
  }
}