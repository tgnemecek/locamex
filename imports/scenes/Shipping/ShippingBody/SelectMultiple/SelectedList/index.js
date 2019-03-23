import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

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
    var variationPlace = e.dataTransfer.getData("variationPlace");
    var available = Number(e.dataTransfer.getData("available"));
    var renting = this.props.item.renting;
    var max = available < renting ? available : renting;

    var existing = tools.findUsingId(this.props.selected, this.props.variation);
    if (existing._id) {
      var remains = renting - existing.selected;
      max = remains < max ? remains : max;
    }

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

  removeFromSelection = (e) => {
    this.props.removeFromSelection(e.target.value);
  }

  renderBody = () => {
    return this.props.selected.map((item, i) => {
      return (
        <tr key={i}>
          <td>{this.props.item.description}</td>
          <td>{i+1}</td>
          <td>{tools.findUsingId(this.props.placesDatabase, item.place).description}</td>
          <td>{item.selected}</td>
          <td><td className="buttom-column"><button value={item._id} onClick={this.removeFromSelection} className="button--table-x">✖</button></td></td>
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
    if (this.props.selected.length) {
      return (
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
      )
    } else return (
      <div onDrop={this.onDrop} onDragOver={this.onDragOver}>
        nada
        {this.howManyBox()}
      </div>
    )
  }
}