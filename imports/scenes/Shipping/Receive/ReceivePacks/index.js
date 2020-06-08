import React from "react";

import tools from "/imports/startup/tools/index";

import Input from "/imports/components/Input/index";
import Icon from "/imports/components/Icon/index";

export default class ReceivePacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packToEdit: false,
      indexToEdit: false,
    };
  }
  componentDidMount() {
    var packs = this.props.currentlyRented.packs.map((pack) => {
      return {
        ...pack,
        place: {},
        unmount: true,
      };
    });
    this.props.update({ packs });
  }

  getAllowedModules = () => {
    if (!this.state.packToEdit) return [];
    var containerId = this.state.packToEdit.container._id;
    return this.props.containersDatabase.find((item) => {
      return item._id === containerId;
    }).allowedModules;
  };

  update = (e) => {
    var packs = [...this.props.packs];
    var _id = e.target.value;
    var i = e.target.name;
    var place;
    if (!_id) {
      place = {};
    } else {
      place = this.props.placesDatabase.find((item) => {
        return item._id === _id;
      });
    }
    packs[i].place = place;
    this.props.update({ packs });
  };

  changeUnmount = (e) => {
    var packs = [...this.props.packs];
    packs[e.target.name].unmount = e.target.value;
    this.props.update({ packs });
  };

  renderOptions = () => {
    return this.props.placesDatabase.map((place, i) => {
      return (
        <option key={i} value={place._id}>
          {place.description}
        </option>
      );
    });
  };

  renderBody = () => {
    return this.props.packs.map((item, i) => {
      console.log(item);
      const openModuleList = () => {
        this.setState({ packToEdit: item, indexToEdit: i });
      };
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td className="table__wide">{item.container.description}</td>
          <td style={{ minWidth: "400px" }}>
            <Input
              type="select"
              value={item.place._id}
              name={i}
              onChange={this.update}
            >
              <option value=""></option>
              {this.renderOptions()}
            </Input>
          </td>
          <td className="no-padding">
            <button onClick={openModuleList}>
              <Icon icon="transaction" />
            </button>
          </td>
          <td>
            <Input
              type="checkbox"
              id={"unmount-" + i}
              name={i}
              parentStyle={{ marginTop: "0" }}
              value={item.unmount}
              onChange={this.changeUnmount}
            />
          </td>
          <td className="no-padding">
            {item.place._id ? (
              <Icon icon="checkmark" color="green" />
            ) : (
              <Icon icon="not" color="red" />
            )}
          </td>
        </tr>
      );
    });
  };

  render() {
    if (this.props.packs.length) {
      return (
        <div>
          <h4>Containers Modulares</h4>
          <table className="table shipping__receive-receive-table">
            <thead>
              <tr>
                <th>#</th>
                <th className="table__wide">Produto</th>
                <th style={{ minWidth: "400px" }}>Destino</th>
                <th>Componentes</th>
                <th>Desmontar</th>
              </tr>
            </thead>
            <tbody>{this.renderBody()}</tbody>
          </table>
          {this.state.packToEdit ? (
            <this.props.ModuleList
              pack={this.state.packToEdit}
              packs={this.props.packs}
              update={this.update}
              disabled={true}
              StockTransition={this.props.StockTransition}
              allowedModules={this.state.packToEdit.modules}
              modulesDatabase={[]}
              toggleWindow={() =>
                this.setState({
                  packToEdit: false,
                })
              }
            />
          ) : null}
        </div>
      );
    } else return null;
  }
}
