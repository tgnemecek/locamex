import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Icon from '/imports/components/Icon/index';
import HowManyBox from './HowManyBox/index';

export default class SelectedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      variationPlace: '',
      max: '',
      howManyBoxOpen: false,
      boxX: '',
      boxY: ''
    }
  }

  onDragOver = (e) => {
    e.preventDefault();
  }

  onDrop = (e) => {
    e.preventDefault();
    var variationPlace = e.dataTransfer.getData("place");
    var available = Number(e.dataTransfer.getData("available"));
    var quantity = this.props.item.quantity;
    var max = available < quantity ? available : quantity;

    var selectedListQuantity = this.props.selectedList.reduce((acc, cur) => {
      return acc + cur.selected;
    }, 0)

    max = (quantity - selectedListQuantity) < max ? (quantity - selectedListQuantity) : max;

    this.setState({
      variationPlace,
      max,
      howManyBoxOpen: true,
      boxX: e.clientX,
      boxY: e.clientY
    })
  }

  closeHowManyBox = () => {
    this.setState({ howManyBoxOpen: false });
  }

  addToSelection = (howManyToMove) => {
    this.props.addToSelection(howManyToMove, this.state.variationPlace);
  }

  renderBody = () => {
    const variationName = (item) => {
      if (this.props.productFromDatabase.variations.length == 1) {
        return "Parão Único";
      } else {
        return "Padrão " + tools.convertToLetter(item.variationIndex);
      }
    }
    return this.props.selectedList.map((item, i) => {
      return (
        <tr key={i}>
          <td>{this.props.productFromDatabase.description}</td>
          <td>{variationName(item)}</td>
          <td>{tools.findUsingId(this.props.placesDatabase, item.place).description}</td>
          <td>{item.selected}</td>
          <td className="buttom-column">
            <button onClick={() => this.props.removeFromSelection(i)}>
              <Icon icon="not"/>
            </button>

          </td>
        </tr>
      )
    })
  }

  howManyBox = () => {
    if (this.state.howManyBoxOpen) {
      return (
        <HowManyBox
          toggleWindow={this.closeHowManyBox}
          boxX={this.state.boxX}
          boxY={this.state.boxY}
          max={this.state.max}
          addToSelection={this.addToSelection}
        />
      )
    } else return null
  }

  render() {
    if (this.props.selectedList.length) {
      return (
        <Block columns={1} title="Quantidade adicionada na remessa:">
          <div onDrop={this.onDrop} onDragOver={this.onDragOver}>
            <table className="table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Variação</th>
                  <th>Pátio</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {this.renderBody()}
              </tbody>
            </table>
            {this.howManyBox()}
          </div>
        </Block>
      )
    } else return (
      <div onDrop={this.onDrop} onDragOver={this.onDragOver} style={{border: "1px solid grey", height: "50px"}}>
        Nenhuma quantidade adicionada. Para adicionar, selecione e arraste até aqui.
        {this.howManyBox()}
      </div>
    )
  }
}