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
    })
    modules[e.target.name] = {
      _id: newItem._id,
      description: newItem.description,
      type: "module",
      renting: 0,
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

  saveEdits = () => {
    var modules = this.state.modules;
    var pack = {...this.props.pack};
    pack.modules = modules;
    this.props.update(pack, this.props.toggleWindow);
  }

  renderBody = () => {
    return this.state.modules.map((item, i) => {
      return (
        <tr key={i}>
          <td>{this.props.pack.description}</td>
          <td>{this.props.pack.container.description}</td>
          <td className="table__wide">
            <Input
              type="select"
              name={i}
              value={item._id}
              onChange={this.setModule}
              >
              <option value=""></option>
              {this.renderOptions(item._id)}
            </Input>
          </td>
          <td>
            {item._id ?
              <button onClick={() => this.setState({
                moduleToEdit: item,
                indexToEdit: i
              })}>
                <Icon icon="transaction"/>
              </button>
            : null}
          </td>
          <td>
            {item.from && item.from.length ?
              <span style={{color: 'green'}}>✔</span>
            : <span style={{color: 'red'}}>⦸</span>}
          </td>
        </tr>
      )
    })
  }
  render() {
    return (
      <Box
        title="Montagem de Container Modular"
        closeBox={this.props.toggleWindow}>
          <table className="table">
            <thead>
              <tr>
                <th>Etiqueta</th>
                <th>Container</th>
                <th className="table__wide">Componente</th>
                <th>Seleção</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.renderBody()}
              <tr>
                <td colSpan={5}>
                  <button onClick={this.addNew}>
                    Adicionar Componente
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <FooterButtons buttons={[
            {text: "Voltar",
            className: "button--secondary",
            onClick: this.props.toggleWindow},
            {text: "Salvar",
            className: "button--primary",
            onClick: this.saveEdits}
          ]}/>
          {this.state.moduleToEdit ?
            <this.props.StockTransition
              update={this.update}
              parentDescription={
                this.props.pack.container.description}
              toggleWindow={() => this.setState({
                moduleToEdit: false
              })}
              places={this.props.allowedModules.find((item) => {
                return item._id === this.state.moduleToEdit._id;
              }).places}
              item={this.state.moduleToEdit}/>
          : null}
      </Box>
    )
  }
}