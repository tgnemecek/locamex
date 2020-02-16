import { Meteor } from 'meteor/meteor';
import React from 'react';

import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import SuggestionBar from '/imports/components/SuggestionBar/index';
import RegisterData from '/imports/components/RegisterData/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class ClientSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      clientWindow: false,
      confirmationWindow: false
    }
  }
  toggleConfirmationWindow = () => {
    this.setState({ confirmationWindow: !this.state.confirmationWindow })
  }
  handleChange = (client) => {
    this.setState({ client })
  }
  toggleClientWindow = (client) => {
    var clientWindow = this.state.clientWindow ? false : {
      description: this.props.proposalClient.description,
      contacts: [
        {
          name: this.props.proposalClient.name,
          email: this.props.proposalClient.email,
          phone1: this.props.proposalClient.phone
        }
      ]
    };
    this.setState({
      clientWindow,
      client: client || this.state.client
    })
  }
  verification = () => {
    if (!this.state.client._id) {
      this.toggleConfirmationWindow();
    } else {
      this.saveEdits();
    }
  }
  saveEdits = () => {
    this.props.updateSnapshot({
      client: this.state.client
    }, this.props.closeWindow)
  }
  render () {
    if (!this.props.proposalClient) return null;
    return (
      <Box
        closeBox={this.toggleConfirmationWindow}
        className="client-setup"
        title="Seleção Inicial de Cliente">
        <h4 className="client-setup__proposal-title">
          Dados da Proposta:
        </h4>
        <div className="client-setup__proposal-body">
          <div>
            <label className="client-setup__label">Nome do Cliente:</label>
            {this.props.proposalClient.description}
          </div>
          <div>
            <label className="client-setup__label">Nome do Contato:</label>
            {this.props.proposalClient.name}
          </div>
          <div>
            <label className="client-setup__label">Email:</label>
            {this.props.proposalClient.email}
          </div>
          <div>
            <label className="client-setup__label">Telefone:</label>
            {this.props.proposalClient.phone}
          </div>
        </div>
        <div className="client-setup__client-body">
          <SuggestionBar
            title="Selecionar Cliente:"
            name="client"
            database={this.props.clientsDatabase}
            fields={['description', 'registry']}
            value={this.state.client}
            onChange={this.handleChange}>
          </SuggestionBar>
          <button onClick={this.toggleClientWindow} className="button--pill client-setup__add-new-button">
            +
          </button>
        </div>
        <FooterButtons buttons={[
          {text: "Adicionar ao Contrato", onClick: this.verification}
        ]}/>
        {this.state.clientWindow ?
          <RegisterData
            type="clients"
            item={this.state.clientWindow}
            toggleWindow={this.toggleClientWindow}
          />
        : null}
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja mesmo iniciar sem cadastrar o cliente?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.saveEdits}}/>
      </Box>
    )
  }
}