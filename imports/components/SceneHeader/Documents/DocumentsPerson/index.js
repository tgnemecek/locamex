import React from 'react';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class DocumentsPerson extends React.Component {
  generate = () => {
    // Saves changes to master
    this.props.updateMaster({
      representativesId: '',
      negociatorId: ''
    }, () => this.props.generateDocument());
  }

  render() {
      return (
        <Box
          title="Emitir Documento:"
          width="400px"
          closeBox={this.props.toggleWindow}>
            <div className="documents">
            </div>
            <FooterButtons buttons={[
              {text: "Salvar e Gerar Documento", className: "button--primary", onClick: this.generate},
            ]}/>
        </Box>
      )
  }
}