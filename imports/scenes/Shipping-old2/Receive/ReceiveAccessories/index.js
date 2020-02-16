import React from 'react';

import tools from '/imports/startup/tools/index';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';
//
// import VariationsList from './VariationsList/index';

export default class ReceiveAccessories extends React.Component {
  componentDidMount() {
    var accessories = this.props.currentlyRented.accessories
    .map((item) => {
      return {
        ...item,
        place: {}
      }
    });
    this.props.update({ accessories });
  }

  update = (accessory, callback) => {
    var accessories = [...this.props.accessories];
    accessories[this.state.indexToEdit] = accessory;
    this.props.update({accessories}, callback);
  }

  renderOptions = () => {
    return this.props.placesDatabase.map((place, i) => {
      return (
        <option key={i} value={place._id}>
          {place.description}
        </option>
      )
    })
  }

  onChange = (e) => {
    var accessories = [...this.props.accessories];
    var _id = e.target.value;
    var i = e.target.name;
    var place;
    if (!_id) {
      place = {};
    } else {
      place = this.props.placesDatabase.find((item) => {
        return item._id === _id;
      })
    }
    accessories[i].place = {
      _id: place._id,
      description: place.description
    }
    this.props.update({ accessories });
  }

  onChangeQuantity = (e) => {
    var accessories = [...this.props.accessories];
    var i = e.target.name;
    accessories[i].quantity = e.target.value;
    this.props.update({ accessories });
  }

  renderBody = () => {
    return this.props.accessories
    .map((item, i) => {
      return (
        <tr key={i}>
          <td>
            {i+1}
          </td>
          <td>
            {item.accessory.description}
          </td>
          <td>
            {item.description}
          </td>
          <td>
            {this.props.currentlyRented.accessories[i].quantity}
          </td>
          <td>
            <Input
              type="number"
              name={i}
              min={0}
              max={this.props.currentlyRented.accessories[i].quantity}
              value={item.quantity}
              onChange={this.onChangeQuantity}
            />
          </td>
          <td className="table__wide">
            <Input
              type="select"
              name={i}
              onChange={this.onChange}
              value={item.place._id}>
                <option value=''></option>
                {this.renderOptions()}
            </Input>
          </td>
          <td className="no-padding">
            {item.place._id && item.quantity
              ? <Icon icon="checkmark" color="green"/>
              : <Icon icon="not" color="red"/>
            }
          </td>
        </tr>
      )
    });
  }

  render() {
    if (this.props.accessories.length) {
      return (
        <div>
          <h4>Acessórios</h4>
          <table className="table shipping__receive-receive-table">
            <thead>
                <tr>
                  <th>#</th>
                  <th>Produto</th>
                  <th>Variação</th>
                  <th>No Cliente</th>
                  <th>Seleção</th>
                  <th className="table__wide">Destino</th>
                </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {/* {this.state.accessoryToEdit ?
            <VariationsList
              accessory={this.state.accessoryToEdit}
              variationsList={this.getVariationsList()}
              update={this.update}
              accessoriesDatabase={this.props.accessoriesDatabase}
              StockTransition={this.props.StockTransition}
              toggleWindow={() => this.setState({
                accessoryToEdit: false
              })}
            />
          : null} */}
        </div>
      )
    } else return null;
  }
}