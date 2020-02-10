import React from 'react';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class HowManyBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      howManyToMove: this.props.max
    }
  }

  onChange = (e) => {
    this.setState({ howManyToMove: e.target.value });
  }

  submit = () => {
    var howManyToMove = this.state.howManyToMove;
    if (howManyToMove > 0) {
      this.props.addToSelection(howManyToMove);
      this.props.toggleWindow();
    }
  }

  render() {
    return (
      <Box
        title="Mover:"
        closeBox={this.props.toggleWindow}
        style={{position: "absolute", left: this.props.boxX, top: this.props.boxY}}
        columns={1}>
        <Input
          type="number"
          value={this.state.howManyToMove}
          onChange={this.onChange}
          min={0}
          max={this.props.max}
        />
        <FooterButtons buttons={[
          {text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow},
          {text: "Adicionar", className: "button--primary", onClick: this.submit},
        ]}/>
      </Box>
    )
  }
}