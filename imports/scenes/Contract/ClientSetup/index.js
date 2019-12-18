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
      clientId: '',
      clientWindow: false,
      confirmationWindow: false
    }
  }
  toggleConfirmationWindow = () => {
    this.setState({ confirmationWindow: !this.state.confirmationWindow })
  }
  handleChange = (e) => {
    this.setState({ clientId: e.target.value })
  }
  toggleClientWindow = () => {
    var clientWindow = this.state.clientWindow ? false : {};
    this.setState({ clientWindow })
  }
  verification = () => {
    if (!this.state.clientId) {
      this.toggleConfirmationWindow();
    } else {
      this.saveEdits();
    }
  }
  saveEdits = () => {
    this.props.updateContract({
      clientId: this.state.clientId
    }, this.props.closeWindow)
  }
  render () {
    if (!this.props.proposal) return null;
    return (
      <Box
        title="Seleção Inicial de Cliente">
          <div className="client-setup">
            <h4 className="client-setup__proposal-title">
              Dados da Proposta:
            </h4>
            <div className="client-setup__proposal-body">
              <div>
                <label className="client-setup__label">Nome do Cliente:</label>
                {this.props.proposal.client.description}
              </div>
              <div>
                <label className="client-setup__label">Nome do Contato:</label>
                {this.props.proposal.client.name}
              </div>
              <div>
                <label className="client-setup__label">Email:</label>
                {this.props.proposal.client.email}
              </div>
              <div>
                <label className="client-setup__label">Telefone:</label>
                {this.props.proposal.client.phone}
              </div>
            </div>
            <div className="client-setup__client-body">
              <SuggestionBar
                title="Selecionar Cliente:"
                name="clientId"
                database={this.props.clientsDatabase}
                fields={['description', 'registry']}
                value={this.state.clientId}
                onClick={this.handleChange}>
              </SuggestionBar>
              <button onClick={this.toggleClientWindow} className="button--pill client-setup__add-new-button">
                +
              </button>
            </div>
            <FooterButtons buttons={[
              {text: "Adicionar Cliente", onClick: this.verification}
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
          </div>
      </Box>
    )
  }
}