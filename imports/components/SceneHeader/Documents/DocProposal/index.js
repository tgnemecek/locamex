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
      includeFlyer: true
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
          width="400px"
          closeBox={this.props.toggleWindow}>
            <div className="documents">
              <Input
                title="Incluir Folders:"
                type="checkbox"
                id="include-flyer"
                value={this.state.includeFlyer}
                onChange={this.onChange}
              />
            </div>
            <FooterButtons buttons={[
              {text: "Salvar e Imprimir Proposta", className: "button--primary", onClick: this.generateDocument},
            ]}/>
        </Box>
      )
  }
}