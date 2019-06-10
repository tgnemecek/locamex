import React from 'react';

import createPdf from '/imports/api/create-pdf/proposal/index';

import Block from '/imports/components/Block/index';
import Input from '/imports/components/Input/index';
import Box from '/imports/components/Box/index';
import FooterButtons from '/imports/components/FooterButtons/index';
import tools from '/imports/startup/tools/index';

export default class DocumentsPerson extends React.Component {
  generate = () => {
    var version = this.props.proposal.version + 1;
    // Saves changes to proposal
    this.props.updateProposal({
      representativesId: '',
      negociatorId: '',
      version
    }, () => {
      createPdf(this.props.proposal);
      this.props.saveProposal();
    });
  }

  render() {
      return (
        <Box
          title="Emitir Contrato:"
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