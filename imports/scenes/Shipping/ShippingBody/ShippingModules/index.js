import React from 'react';

import tools from '/imports/startup/tools/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import ImageVisualizer from '/imports/components/ImageVisualizer/index';

import SelectMultiple from './SelectMultiple/index';

export default class ShippingModules extends React.Component {
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
        <th>Componente</th>
        <th>Quantidade</th>
        <th>Seleção</th>
        <th>+/-</th>
      </tr>
    )
  }

  toggleMultipleWindow = (e) => {
    var index = e ? e.target.value : null;
    if (!this.props.modules[index]._id) return;
    var itemToSelect = this.state.selectMultiple ? false : this.props.modules[index];
    this.setState({ selectMultiple: !this.state.selectMultiple, itemToSelect });
  }

  renderBody = () => {
    function checkmark(item) {
      if (!item._id || !item.selectedList) return <span style={{color: 'red'}}>✖</span>;
      return <span style={{color: 'green'}}>✔</span>
    }

    const renderOptions = (currentId) => {
      var filtered = this.props.modulesDatabase.filter((item) => {
        return !this.props.modules.find((element) => {
          if (element._id === item._id) {
            return (currentId !== item._id);
          } else return false;
        })
      })
      return filtered.map((item, i) => {
        return <option key={i} value={item._id}>{item.description}</option>
      })
    }

    const onChange = (e) => {
      var _id = e.target.value;
      var modules = tools.deepCopy(this.props.modules);
      var index = e.target.name;
      modules[index] = { _id }
      this.props.onChange({ modules });
    }

    const removeItem = (e) => {
      var index = e.target.value;
      var modules = tools.deepCopy(this.props.modules);
      modules.splice(index, 1);
      this.props.onChange({ modules });
    }

    return this.props.modules.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td>
            <Input
              type="select"
              name={i}
              onChange={onChange}
              value={item._id}>
                <option value="">Selecione um componente</option>
                {renderOptions(item._id)}
            </Input>
          </td>
          <td>{item.renting}</td>
          <td><button className="database__table__button" value={i} onClick={this.toggleMultipleWindow}>⟳</button></td>
          <td><button className="database__table__button" value={i} onClick={removeItem}>✖</button></td>
          <td className="table__small-column">{checkmark(item)}</td>
        </tr>
      )
    });
  }

  renderAddNew = () => {
    const onClick = () =>  {
      var modules = tools.deepCopy(this.props.modules);
      modules.push({
        _id: ''
      })
      this.props.onChange({ modules });
    }
    return (
      <tr onClick={onClick}>
        <td colSpan="5" className="shipping__modules__add-new">Adicionar novo Componente</td>
      </tr>
    )
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
    if (this.props.modulesEnabled) {
      return (
        <Block columns={1} title="Componentes">
          <table className="table">
            <thead>
              {this.renderHeader()}
            </thead>
            <tbody>
              {this.renderBody()}
              {this.renderAddNew()}
            </tbody>
          </table>
          {this.state.selectMultiple && this.state.itemToSelect ?
            <SelectMultiple
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