import React from 'react';

import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import StockVisualizer from '/imports/components/StockVisualizer/index';
import Box from '/imports/components/Box/index';
import Icon from '/imports/components/Icon/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class ModuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modules: tools.deepCopy(this.props.pack.modules),
      moduleToEdit: false,
      indexToEdit: false
    }
  }
  setModule = (e) => {
    var modules = [...this.state.modules]
    var newItem = this.props.allowedModules.find((item) => {
      return item._id === e.target.value;
    }) || {};
    modules[e.target.name] = {
      _id: newItem._id,
      description: newItem.description,
      type: "module",
      quantity: 0,
      from: []
    };
    this.setState({
      modules
    })
  }
  addNew = () => {
    var modules = [...this.state.modules]
    modules.push({
      _id: '',
      description: '',
      modules: []
    })
    this.setState({
      modules
    })
  }
  removeModule = (i) => {
    var modules = [...this.state.modules];
    modules.splice(i, 1);
    this.setState({
      modules
    })
  }
  update = (from, callback) => {
    var modules = [...this.state.modules];
    modules[this.state.indexToEdit].from = from;
    this.setState({ modules }, callback);
  }
  renderOptions = (moduleId) => {
    return this.props.allowedModules
      .filter((item) => {
        if (item._id === moduleId) return true;
        return !this.state.modules.find((module) => {
          return module._id === item._id;
        })
      })
      .map((item, i) => {
        return (
          <option key={i} value={item._id}>
            {item.description}
          </option>
        )
      })
  }

  getPlaces = () => {
    var fromDatabase = this.props.modulesDatabase.find((item) => {
      return item._id === this.state.moduleToEdit._id;
    }).places;

    var joinedModules = [];
    this.props.packs.forEach((pack) => {
      if (pack !== this.props.pack) {
        joinedModules = joinedModules.concat(pack.modules);
      }
    })
    var filteredModules = joinedModules.filter((item) => {
      return item._id === this.state.moduleToEdit._id;
    })
    var quantityByPlace = filteredModules.reduce((acc, item) => {
      return acc.concat(item.from);
    }, [])
    return fromDatabase.map((item) => {
      var quantity = quantityByPlace.reduce((acc, cur) => {
        if (cur._id === item._id) {
          return acc + cur.quantity;
        } else return acc;
      }, 0)
      return {
        ...item,
        available: item.available - quantity
      }
    })
  }

  renderTransactionCell = (item, i) => {
    if (this.props.disabled) {
      return (
        <td>{item.quantity}</td>
      )
    } else {
      return (
        <td className="no-padding">
          {item._id ?
            <button onClick={() => this.setState({
              moduleToEdit: item,
              indexToEdit: i
            })}>
              <Icon icon="transaction"/>
            </button>
          : null}
        </td>
      )
    }
  }

  saveEdits = () => {
    var modules = this.state.modules;
    var pack = {...this.props.pack};
    modules = modules.filter((module) => {
      return module._id
    })
    pack.modules = modules;
    this.props.update(pack, this.props.toggleWindow);
  }

  renderBody = () => {
    return this.state.modules.map((item, i) => {
      return (
        <tr key={i}>
          <td>{i+1}</td>
          <td className="table__wide">
            <Input
              type="select"
              name={i}
              value={item._id}
              onChange={this.setModule}
              disabled={this.props.disabled}
              >
              <option value=""></option>
              {this.renderOptions(item._id)}
            </Input>
          </td>
          {this.renderTransactionCell(item, i)}
          <td className="no-padding">
            {this.props.disabled ||
              (item.from && item.from.length)
              ? <Icon icon="checkmark" color="green"/>
              : <Icon icon="not" color="red"/>
            }
          </td>
          {!this.props.disabled ?
            <td>
              <button onClick={() => this.removeModule(i)}>
                <Icon icon="not"/>
              </button>
            </td>
          : null}
        </tr>
      )
    })
  }
  render() {
    return (
      <Box
        title="Lista de Componentes"
        className="shipping__sub-list"
        closeBox={this.props.toggleWindow}>
        <h4>
          {this.props.pack.container.description + " #" + this.props.pack.description}
        </h4>
        <div className="shipping__sub-list__scroll">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th className="table__wide">Componente</th>
                <th>Seleção</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
        </div>
        {!this.props.disabled ?
          <table className="table">
            <tbody>
              <tr>
                <td className="shipping__sub-list__add-new">
                  <button onClick={this.addNew}>
                    Adicionar Componente
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        : null}
          <FooterButtons buttons={!this.props.disabled ? [
            {text: "Voltar",
            className: "button--secondary",
            onClick: this.props.toggleWindow},
            {text: "Salvar",
            className: "button--primary",
            onClick: this.saveEdits}
          ] : [
            {text: "Voltar",
            className: "button--secondary",
            onClick: this.props.toggleWindow}
          ]}/>
          {!this.props.disabled && this.state.moduleToEdit ?
            <this.props.StockTransition
              update={this.update}
              title={`Produto: ${this.props.pack.container.description}`}
              parentDescription={this.props.pack.container.description}
              toggleWindow={() => this.setState({
                moduleToEdit: false
              })}
              places={this.getPlaces()}
              item={this.state.moduleToEdit}/>
          : null}
      </Box>
    )
  }
}