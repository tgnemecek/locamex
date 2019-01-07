import { Meteor } from 'meteor/meteor';
import React from 'react';
import tools from '/imports/startup/tools/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import Block from '/imports/components/Block/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import StockVisualizer from '/imports/components/StockVisualizer/index';

export default class StockSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      item: this.props.items[0]
    }
  }
  nextItem = () => {
    var index = this.state.index + 1;
    if (index >= this.props.items.length) {
      this.activateContract();
    } else {
      var item = this.props.items[index];
      this.setState({ index, item });
    }
  }
  activateContract = () => {
    return null;
  }
  render() {
    return (
      <Box
        title={this.state.item.description}>
        <StockVisualizer
          isContract={true}
          item={this.state.item}/>
        <FooterButtons buttons={[
          {text: "Cancelar", className: "button--secondary", onClick: () => this.props.toggleWindow()},
          {text: "Próximo", onClick: () => this.nextItem()}
        ]}/>
      </Box>
    )
  }
}