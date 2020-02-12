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
      placeId: '',
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
    var placeId = e.dataTransfer.getData("placeId");
    var available = Number(e.dataTransfer.getData("available"));
    var max;
    if (this.props.max !== undefined) {
      max = this.props.max;
      var fromListQuantity = this.props.from.reduce((acc, cur) => {
        return acc + cur.renting;
      }, 0)
      max = max - fromListQuantity;
      // max = max < fromListQuantity ? max : fromListQuantity;
      max = available < max ? available : max;
    } else {
      max = available;
    }
    this.setState({
      placeId,
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
    this.props.addToSelection(
      howManyToMove, this.state.placeId
    );
  }

  renderBody = () => {
    return this.props.from.map((item, i) => {
      return (
        <tr key={i}>
          <td>{this.props.title}</td>
          <td>{this.props.item.description}</td>
          <td>{item.description}</td>
          <td>{item.renting}</td>
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
    if (this.props.from.length) {
      return (
        <>
          <h4>Quantidade adicionada na remessa</h4>
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
        </>
      )
    } else return (
      <div onDrop={this.onDrop} onDragOver={this.onDragOver} style={{border: "1px solid grey", height: "50px"}}>
        Nenhuma quantidade adicionada. Para adicionar, selecione e arraste até aqui.
        {this.howManyBox()}
      </div>
    )
  }
}