import React from 'react';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Observations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      internal: this.props.proposal.observations.internal || '',
      external: this.props.proposal.observations.external || ''
    }
  }

  onChange = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    this.setState({ [key]: value });
  }

  saveEdits = () => {
    this.props.updateProposal({ observations: this.state });
    this.props.toggleWindow();
  }

  render() {
      return (
        <Box
          title="Observações"
          closeBox={this.props.toggleWindow}
          width="400px">
            <div>
              <div className="observations__body">
                <Input
                  title="Controle Interno:"
                  name="internal"
                  type="textarea"
                  value={this.state.internal}
                  onChange={this.onChange}/>
                <Input
                  title="Expresso em Contrato:"
                  name="external"
                  type="textarea"
                  value={this.state.external}
                  onChange={this.onChange}/>
              </div>
              <FooterButtons buttons={[{text: "Salvar Edições", onClick: this.saveEdits}]}/>
            </div>
        </Box>
      )
  }
}