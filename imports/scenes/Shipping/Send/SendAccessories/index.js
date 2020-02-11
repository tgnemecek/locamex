import React from 'react';

import tools from '/imports/startup/tools/index';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

import VariationsList from './VariationsList/index';

export default class SendPacks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessoryToEdit: false,
      indexToEdit: false
    }
  }
  componentDidMount() {
    var accessories = [];
    this.props.snapshot.accessories.forEach((accessory, j) => {
      accessories.push({
        _id: accessory._id,
        description: accessory.description,
        type: "accessory",
        variations: [],
        max: accessory.renting
      })
    })
    this.props.update({ accessories });
  }

  update = (accessory, callback) => {
    var accessories = [...this.props.accessories];
    accessories[this.state.indexToEdit] = accessory;
    this.props.update({accessories}, callback);
  }

  getVariationsList = () => {
    return this.props.snapshot.accessories.find((item) => {
      return item._id === this.state.accessoryToEdit._id;
    }).variations;
  }

  renderBody = () => {
    return this.props.accessories.map((item, i) => {
      const openVariationsList = () => {
        this.setState({ accessoryToEdit: item, indexToEdit: i })
      }
      return (
        <tr key={i}>
          <td>
            {i+1}
          </td>
          <td className="table__wide">
            {item.description}
          </td>
          <td>
            {item.max}
          </td>
          <td>
            {item.variations.reduce((acc, cur) => {
              return acc + cur.from.reduce((acc, cur) => {
                return acc + cur.renting;
              }, 0)
            }, 0)}
          </td>
          <td>
            <button onClick={openVariationsList}>
              <Icon icon="transaction"/>
            </button>
          </td>
          <td>
            {item.variations.find((variation) => {
                return variation.from.find((place) => {
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
    if (this.props.accessories.length) {
      return (
        <div>
          <h4>Acessórios</h4>
          <table className="table">
            <thead>
                <tr>
                  <th>#</th>
                  <th className="table__wide">Produto</th>
                  <th>Contratado</th>
                  <th>Selecionado</th>
                  <th>Variações</th>
                </tr>
            </thead>
            <tbody>
              {this.renderBody()}
            </tbody>
          </table>
          {this.state.accessoryToEdit ?
            <VariationsList
              accessory={this.state.accessoryToEdit}
              variationsList={this.getVariationsList()}
              update={this.update}
              StockTransition={this.props.StockTransition}
              toggleWindow={() => this.setState({
                accessoryToEdit: false
              })}
            />
          : null}
        </div>
      )
    } else return null;
  }
}