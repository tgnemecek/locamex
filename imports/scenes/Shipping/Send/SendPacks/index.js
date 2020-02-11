import React from 'react';

import tools from '/imports/startup/tools/index';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

import ModuleList from './ModuleList/index';

export default class SendPacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packToEdit: false,
      indexToEdit: false
    }
  }
  componentDidMount() {
    var filter = this.props.snapshot.containers
      .filter((item) => {
        return item.type === "modular";
      })
    var packs = [];
    filter.forEach((modular, j) => {
      for (var i = 0; i < modular.renting; i++) {
        packs.push({
          _id: '',
          description: j+i+1,
          type: "pack",
          modules: [],
          container: {
            _id: modular._id,
            description: modular.description
          }
        })
      }
    })
    this.props.update({ packs });
  }

  getAllowedModules = () => {
    if (!this.state.packToEdit) return [];
    var containerId = this.state.packToEdit.container._id;
    var container = this.props.snapshot.containers.find((item) => {
      return item._id === containerId;
    })
    return container.allowedModules;
  }

  update = (pack, callback) => {
    var packs = [...this.props.packs];
    packs[this.state.indexToEdit] = pack;
    this.props.update({packs}, callback);
  }

  renderBody = () => {
    return this.props.packs.map((item, i) => {
      const openModuleList = () => {
        this.setState({ packToEdit: item, indexToEdit: i })
      }
      return (
        <tr key={i}>
          <td>
            {item.description}
          </td>
          <td className="table__wide">
            {item.container.description}
          </td>
          <td>
            <button onClick={openModuleList}>
              <Icon icon="transaction"/>
            </button>
          </td>
          <td>
            {item.modules.find((module) => {
                return module.from.find((place) => {
                  return place.renting > 0;
                })
              })
            ?
              <span style={{color: 'green'}}>✔</span>
            :
              <span style={{color: 'red'}}>⦸</span>}
          </td>
        </tr>
      )
    });
  }

  render() {
    if (this.props.packs.length) {
      return (
        <div>
          <h4>Containers Modulares</h4>
          <table className="table">
            <thead>
                <tr>
                  <th>Etiqueta</th>
                  <th className="table__wide">Produto</th>
                  <th>
                    Componentes
                  </th>
                </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.state.packToEdit ?
            <ModuleList
              pack={this.state.packToEdit}
              update={this.update}
              StockTransition={this.props.StockTransition}
              allowedModules={this.getAllowedModules()}
              toggleWindow={() => this.setState({
                packToEdit: false
              })}
              // modules={item.modules}
              // modulesDatabase={this.props.modulesDatabase}
              // placesDatabase={this.props.placesDatabase}
              // allowedModules={item.allowedModules}
              // updateModules={updateModules}
            />
          : null}
        </div>
      )
    } else return null;
  }
}