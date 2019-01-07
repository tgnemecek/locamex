import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import StockSelector from './StockSelector/index';

export default class Activate extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toggleStockSelector: false,
      productInFocus: 0
    }
  }

  concatQuantitative = () => {
    var containers = [];
    var accessories = [];
    this.props.contract.containers.forEach((container) => {
      if (container.type === "modular") {
        containers.push(container);
      }
    })
    this.props.contract.accessories.forEach((accessory) => {
      if (accessory.quantitative) {
        accessories.push(accessory);
      }
    })
    console.log(containers.concat(accessories));
    return containers.concat(accessories);
  }

  toggleStockSelector = () => {
    if (!this.concatQuantitative().length) {
      this.activateContract();
    } else {
      this.setState({ toggleStockSelector: !this.state.toggleStockSelector });
    }
  }

  activateContract = () => {
    return null;
  }

  render() {
    return (
      <Box
        title="Aviso:"
        closeBox={this.props.toggleWindow}>
        <p>Deseja ativar este contrato e locar os itens?</p>
        <FooterButtons buttons={[
          {text: "Não", className: "button--secondary", onClick: () => this.props.toggleWindow()},
          {text: "Sim", onClick: () => this.toggleStockSelector()}
        ]}/>
        {this.state.toggleStockSelector ?
          <StockSelector
            items={this.concatQuantitative()}
            />
        : null}
      </Box>
    )
  }
}