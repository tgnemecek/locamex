import React from 'react';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class DocProposal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      includeFlyer: true,
    }
  }
  onChange = (e) => {
    this.setState({ includeFlyer: e.target.value });
  }
  generateDocument = () => {
    this.props.generateDocument(this.state.includeFlyer);
  }
  render() {
      return (
        <Box
          title="Imprimir Proposta:"
          className="documents"
          closeBox={this.props.toggleWindow}>
            <Input
              title="Incluir Folders:"
              type="checkbox"
              id="include-flyer"
              value={this.state.includeFlyer}
              onChange={this.onChange}
            />
            {this.props.children}
            <FooterButtons buttons={[
              {text: "Salvar e Imprimir Proposta", className: "button--primary", onClick: this.generateDocument},
            ]}/>
        </Box>
      )
  }
}