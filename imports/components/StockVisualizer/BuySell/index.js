import React from 'react';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';

export default class BuySell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      in: 0,
      out: 0
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  setOffset = (which) => {
    var offset = this.state[which];
    if (which === 'out') offset = -offset;
    this.props.setOffset(offset, () => {
      this.setState({ [which]: 0 })
    });
  }
  render() {
    return (
      <div className="stock-visualizer__buy-sell">
        <div className="stock-visualizer__inputs">
          <Input
            title="Entrada:"
            type="number"
            name="in"
            min={0}
            max={999}
            value={this.state.in}
            onChange={this.onChange}
          />
          <button className="button--pill"
            onClick={() => this.setOffset('in')}>
            Aplicar
          </button>
        </div>
        <div className="stock-visualizer__ammounts">
          <div style={{textAlign: "right"}}>
            <div>Soma:</div>
            <div>Modificação:</div>
            <div>Total:</div>
          </div>
          <div style={{textAlign: "left"}}>
            <div>{this.props.sumOfPlaces}</div>
            <div>{this.props.offset}</div>
            <div>{this.props.totalGoal}</div>
          </div>
        </div>
        <div className="stock-visualizer__inputs">
          <Input
            title="Saída:"
            type="number"
            name="out"
            min={0}
            max={999}
            value={this.state.out}
            onChange={this.onChange}
          />
          <button className="button--pill"
            onClick={() => this.setOffset('out')}>
            Aplicar
          </button>
        </div>
      </div>
    )
  }
}