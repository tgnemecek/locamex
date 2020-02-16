import React from 'react';

import tools from '/imports/startup/tools/index';

import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';

import VariationsList from './VariationsList/index';

export default class SendVariations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessoryToFilter: false
    }
  }
  // componentDidMount() {
  //   var accessories = [];
  //   this.props.snapshot.accessories.forEach((accessory, j) => {
  //     var onClient = this.props.currentlyRented.accessories
  //       .reduce((acc, item) => {
  //         if (item.accessory._id === accessory._id) {
  //           return acc + item.quantity;
  //         } else return acc;
  //       }, 0)
  //
  //     var max = accessory.quantity - onClient;
  //
  //     if (max > 0) {
  //       accessories.push({
  //         _id: accessory._id,
  //         description: accessory.description,
  //         type: "accessory",
  //         variations: [],
  //         max
  //       })
  //     }
  //   })
  //   this.props.update({ accessories });
  // }
  //
  //
  // getVariationsList = () => {
  //   return this.props.accessoriesDatabase.find((item) => {
  //     return item._id === this.state.accessoryToFilter._id;
  //   }).variations;
  // }
  //
  renderBody = (filtered) => {
    return filtered.map((item, i) => {
      const openVariationsList = () => {
        this.setState({ accessoryToFilter: item })
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
            {this.props.variations
              .filter((variation) => {
                return variation.accessory._id === item._id
              })
              .reduce((acc, cur) => {
              return acc + cur.from.reduce((acc, cur) => {
                return acc + cur.quantity;
              }, 0)
            }, 0)}
          </td>
          <td className="no-padding">
            <button onClick={openVariationsList}>
              <Icon icon="transaction"/>
            </button>
          </td>
          {/* <td className="no-padding">
            {item.variations.find((variation) => {
                return variation.from.find((place) => {
                  return place.quantity > 0;
                })
              })
              ? <Icon icon="checkmark" color="green"/>
              : <Icon icon="not" color="red"/>
            }
          </td> */}
        </tr>
      )
    });
  }

  render() {
    var filtered = this.props.snapshot.accessories
      .filter((accessory) => {
        // ADD CurrentlyRented FILTER HERE!
        accessory.max = accessory.quantity;
        return true;
      })
    if (!filtered.length) return null;

    return (
      <div>
        <h4>Acessórios</h4>
        <table className="table shipping__send-receive-table">
          <thead>
              <tr>
                <th>#</th>
                <th className="table__wide">Produto</th>
                <th>Locável</th>
                <th>Selecionado</th>
              </tr>
          </thead>
          <tbody>
            {this.renderBody(filtered)}
          </tbody>
        </table>
        {this.state.accessoryToFilter ?
          <VariationsList
            accessory={this.state.accessoryToFilter}
            variations={this.props.variations}
            update={this.props.update}
            variationsDatabase={this.props.variationsDatabase}
            StockTransition={this.props.StockTransition}
            toggleWindow={() => this.setState({
              accessoryToFilter: false
            })}
          />
        : null}
      </div>
    )
  }
}