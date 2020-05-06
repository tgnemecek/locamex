import React from 'react';

import tools from '/imports/startup/tools/index';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

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
      var rented = this.props.currentlyRented.packs
        .filter((item) => {
          return item.container._id === modular._id
        }).length;

      var quantity = modular.quantity - rented;
      for (var i = 0; i < quantity; i++) {
        packs.push({
          _id: '',
          description: j+i+1,
          type: "pack",
          modules: [],
          locked: false,
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
    return this.props.containersDatabase.find((item) => {
      return item._id === containerId;
    }).allowedModules;
  }

  update = (pack, callback) => {
    var packs = [...this.props.packs];
    packs[this.state.indexToEdit] = pack;
    this.props.update({packs}, callback);
  }

  updateWithLockedPack = (e) => {
    var _id = e.target.value;
    var i = e.target.name;
    var pack;
    if (!_id) {
      pack = {
        ...this.props.packs[i],
        locked: false,
        _id: '',
        description: i+1,
        modules: []
      }
    } else {
      pack = this.props.packsDatabase.find((item) => {
        return item._id === _id;
      }) || {};
      pack.locked = true;
    }

    var packs = [...this.props.packs];
    packs[i] = pack;
    this.props.update({packs});
  }

  renderBody = () => {
    return this.props.packs.map((item, i) => {
      var packs = this.props.packsDatabase.filter((item) => {
        if (item.container._id !== item.container._id) {
          return false
        }
        return !this.props.packs.find((pack, packIndex) => {
          return (pack._id === item._id && packIndex !== i)
        })
      })
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
          <td style={{minWidth: "400px"}}>
            <Input
              type="select"
              value={item._id}
              name={i}
              onChange={this.updateWithLockedPack}
              >
                <option value=""></option>
              {packs.map((item, i) => {
                return (
                  <option key={i} value={item._id}>
                    {`Série: ${item.description}. Pátio: ${item.place.description}`}
                  </option>
                )
              })}
            </Input>
          </td>
          <td className="no-padding">
            <button onClick={openModuleList}>
              <Icon icon="transaction"/>
            </button>
          </td>
          <td className="no-padding">
            {item.locked || item.modules.find((module) => {
                return module.places.find((place) => {
                  return place.quantity > 0;
                })
              })
              ? <Icon icon="checkmark" color="green"/>
              : <Icon icon="not" color="red"/>
            }
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
          <div className="shipping__table-scroll">
            <table className="table shipping__send-receive-table">
              <thead>
                  <tr>
                    <th>#</th>
                    <th className="table__wide">Produto</th>
                    <th style={{minWidth: "400px"}}>
                      Pré-Montados
                    </th>
                  </tr>
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
          </div>
          {this.state.packToEdit ?
            <this.props.ModuleList
              pack={this.state.packToEdit}
              packs={this.props.packs}
              update={this.update}
              disabled={this.state.packToEdit.locked}
              StockTransition={this.props.StockTransition}
              allowedModules={this.getAllowedModules()}
              modulesDatabase={this.props.modulesDatabase}
              toggleWindow={() => this.setState({
                packToEdit: false
              })}
            />
          : null}
        </div>
      )
    } else return null;
  }
}