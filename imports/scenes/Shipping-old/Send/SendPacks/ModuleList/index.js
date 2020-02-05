import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';
import Icon from '/imports/components/Icon/index';

import SelectModules from './SelectModules/index';

export default class ModuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleToEdit: false
    }
  }
  toggleMultipleWindow = (index) => {
    if (index === undefined) {
      this.setState({
        moduleToEdit: false
      });
      return;
    }
    var item = this.props.modules[index];
    if (item.productId) {
      this.setState({
        moduleToEdit: item
      });
    }
  }

  filterAllowedModules = () => {
    return this.props.modulesDatabase.filter((item) => {
      return this.props.allowedModules.find((obj) => {
        return obj === item._id;
      })
    })
  }

  removeItem = (index) => {
    var newModules = tools.deepCopy(this.props.modules);
    newModules.splice(index, 1);
    this.props.updateModules(newModules);
  }

  addNew = () => {
    var newModules = [...this.props.modules];
    newModules.push({
      _id: tools.generateId(),
      description: "",
      productId: "",
      selected: []
    });
    this.props.updateModules(newModules);
  }

  setProduct = (e) => {
    var newModules = [...this.props.modules];
    var i = e.target.name;
    var productId = e.target.value;
    if (productId !== newModules[i].productId) {
      newModules[i] = {
        _id: newModules[i]._id,
        productId,
        description: productId ? this.props.modulesDatabase.find((obj) => {
          return obj._id === productId;
        }).description : "",
        selected: []
      };
      this.props.updateModules(newModules);
    }
  }

  setSelected = (_id, selected) => {
    var index = this.props.modules.findIndex((item) => {
      return item._id === _id;
    })
    var newModules = [...this.props.modules];
    newModules[index].selected = selected;
    this.props.updateModules(newModules);
  }

  renderBody = () => {
    return this.props.modules.map((item, i) => {
      return (
        <tr key={i}>
          <td>
            <SuggestionBar
              database={this.filterAllowedModules()}
              value={item.productId}
              fields={['description']}
              name={i}
              showAll={true}
              onClick={this.setProduct}/>
          </td>
          <td className="table__small-column">
            {item.selected ?
              item.selected.reduce((acc, cur) => {
                return acc + cur.selected;
              }, 0)
            : null}
          </td>
          <td className="table__small-column">
            <button onClick={() => this.toggleMultipleWindow(i)}>
              <Icon icon="transaction"/>
            </button>
          </td>
          <td className="table__small-column">
            <button onClick={() => this.removeItem(i)}>
              <Icon icon="not"/>
            </button>
          </td>
        </tr>
      )
    });
  }

  render() {
    return (
      <>
      <table className="table">
        <thead>
          <tr>
            <th>Componente</th>
            <th>Seleção</th>
            <th></th>
            <th>
              <button onClick={this.addNew}>
                <Icon icon="new" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
      {this.state.moduleToEdit ?
        <SelectModules
          item={this.state.moduleToEdit}
          toggleWindow={this.toggleMultipleWindow}
          modulesDatabase={this.props.modulesDatabase}
          placesDatabase={this.props.placesDatabase}
          productFromDatabase={this.props.modulesDatabase.find((item) => item._id === this.state.moduleToEdit.productId)}
          setSelected={this.setSelected}
        />
      : null}
      </>
    )
  }
}