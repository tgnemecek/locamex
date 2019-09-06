import React from 'react';

import Box from '/imports/components/Box/index';
import Input from '/imports/components/Input/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Observations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      internal: this.props.master.observations.internal || '',
      external: this.props.master.observations.external || ''
    }
  }

  onChange = (e) => {
    var value = e.target.value;
    var key = e.target.name;
    this.setState({ [key]: value });
  }

  saveEdits = () => {
    this.props.updateMaster({ observations: this.state });
    this.props.toggleWindow();
  }

  render() {
      return (
        <Box
          title="Observações"
          className="observations"
          closeBox={this.props.toggleWindow}
          width="400px">
            <Input
              title="Controle Interno:"
              name="internal"
              type="textarea"
              disabled={this.props.disabled}
              value={this.state.internal}
              onChange={this.onChange}/>
            <Input
              title="Para o Cliente:"
              name="external"
              type="textarea"
              disabled={this.props.disabled}
              value={this.state.external}
              onChange={this.onChange}/>
            <FooterButtons buttons={this.props.disabled
              ? [{text: "Voltar", className: "button--secondary", onClick: this.props.toggleWindow}]
              : [{text: "Salvar Edições", onClick: this.saveEdits}]}/>
        </Box>
      )
  }
}