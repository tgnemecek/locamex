import React from 'react';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class DocContractPerson extends React.Component {
  render() {
      return (
        <Box
          title="Emitir Documento:"
          className="documents"
          closeBox={this.props.toggleWindow}>
            <FooterButtons buttons={[
              {text: "Salvar e Gerar Documento", className: "button--primary", onClick: this.props.generateDocument},
            ]}/>
        </Box>
      )
  }
}