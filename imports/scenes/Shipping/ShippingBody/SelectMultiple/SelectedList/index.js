import React from 'react';

import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';

export default class SelectedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0
    }
  }

  onDragOver = (e) => {
    e.preventDefault();
  }

  onDrop = (e) => {
    e.preventDefault();
    var itemIndex = e.dataTransfer.getData("itemIndex");
    var itemPlace = e.dataTransfer.getData("itemPlace");
    this.props.addToSelection(itemIndex, itemPlace, this.state.quantity);
  }

  renderBody = () => {
    return this.props.selected.map((item, i) => {
      return (
        <tr key={i}>
          <td>{item.description}</td>
          <td>{item.variation}</td>
          <td>{item.place}</td>
          <td>{item.quantity}</td>
        </tr>
      )
    })
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
        </div>
      )
    } else return (
      <div onDrop={this.onDrop} onDragOver={this.onDragOver}>
        nada
      </div>
    )
  }
}