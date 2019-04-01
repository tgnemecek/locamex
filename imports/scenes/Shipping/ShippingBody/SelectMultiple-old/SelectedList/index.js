import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

import HowManyBox from './HowManyBox/index';

export default class SelectedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placesWithQuantity: '',
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
    var placesWithQuantity = e.dataTransfer.getData("place");
    var available = Number(e.dataTransfer.getData("available"));
    var renting = this.props.item.renting || 999;
    var max = available < renting ? available : renting;

    var selectedListQuantity = this.props.selectedList.reduce((acc, cur) => {
      return acc + cur.selected;
    }, 0)

    max = (renting - selectedListQuantity) < max ? (renting - selectedListQuantity) : max;

    this.setState({
      placesWithQuantity,
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
    this.props.addToSelection(howManyToMove, this.state.placesWithQuantity);
  }

  removeFromSelection = (e) => {
    this.props.removeFromSelection(e.target.value);
  }

  renderHeader = () => {
    if (this.props.item.variations) {
      return (
        <tr>
          <th>Produto</th>
          <th>Variação</th>
          <th>Pátio</th>
          <th>Quantidade</th>
        </tr>
      )
    } else {
      return (
        <tr>
          <th>Produto</th>
          <th>Pátio</th>
          <th>Quantidade</th>
        </tr>
      )
    }
  }

  renderBody = () => {
    return this.props.selectedList.map((item, i) => {
      return (
        <tr key={i}>
          <td>{this.props.productFromDatabase.description}</td>
          <td>{i+1}</td>
          <td>{tools.findUsingId(this.props.placesDatabase, item.place).description}</td>
          <td>{item.selected}</td>
          <td className="buttom-column"><button value={i} onClick={this.removeFromSelection} className="button--table-x">✖</button></td>
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
                {this.renderHeader()}
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
        Nenhuma quantidade adicionada. Para adicionar, selecione o estoque e arraste até aqui.
        {this.howManyBox()}
      </div>
    )
  }
}