import { Meteor } from 'meteor/meteor';
import React from 'react';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';
import tools from '/imports/startup/tools/index';
import Block from '/imports/components/Block/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import Input from '/imports/components/Input/index';

export default class BuySell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      in: 0,
      out: 0
    };
  }
  onChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    this.setState({ [name]: value })
  }
  applyChange = (e) => {
    var name = e.target.name;
    var value;
    if (name === "in") {
      value = this.state.in;
    } else if (name === "out") {
      value = (0 - this.state.out);
    }
    this.props.changeTotal(value);
    this.setState({ [name]: 0 })
  }
  render() {
    return (
      <div className="stock-visualizer__buy-sell-wrapper">
        <div className="stock-visualizer__buy-sell-ammounts" style={this.props.errorKeys.includes("sum") ? {color: "red"} : null}>
          TOTAL: {this.props.totalItems} / SOMA ATUAL: {this.props.sumItems}
        </div>
        <div className="stock-visualizer__buy-sell">
          <Input
            title="Compra/Entrada"
            min={0}
            name="in"
            type="number"
            onChange={this.onChange}
            value={this.state.in}
          />
          <button className="button--pill stock-visualizer__buy-sell__button" name="in" onClick={this.applyChange}>Aplicar</button>
        </div>
        <div className="stock-visualizer__buy-sell">
          <Input
            title="Desmanche/Saída"
            min={0}
            max={this.props.totalItems}
            name="out"
            type="number"
            onChange={this.onChange}
            value={this.state.out}
          />
          <button className="button--pill stock-visualizer__buy-sell__button" name="out" onClick={this.applyChange}>Aplicar</button>
        </div>
      </div>
    )
  }
}