import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmationWindow: false
    }
  }

  toggleActivateWindow = () => {
    if (this.props.verifyFields()) {
      this.setState({ confirmationWindow: 'activate' });
    }
  }

  toggleWindowsOff = () => {
    this.setState({ confirmationWindow: false });
  }

  renderButtons = () => {
    if (this.props.status === 'inactive') {
      return (
        <FooterButtons buttons={[
          {text: "Salvar Versão", className: "button--secondary", onClick: this.props.saveEdits},
          {text: "Ativar Contrato", className: "button--primary", onClick: this.toggleActivateWindow},
        ]}/>
      )
    } else return null;
  }

  activateContract = () => {
    this.props.activateContract(() => this.setState({ confirmationWindow: false }))
  }

  render() {
    return (
      <div className="main-scene__footer">
        <div className="error-message">{this.props.errorMsg}</div>
        <div className="main-scene__total-value">
          <h3>
            Valor Total: {tools.format(this.props.totalValue, 'currency')}
          </h3>
        </div>
        {this.renderButtons()}
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow === 'activate'}
          closeBox={this.toggleWindowsOff}
          message="Deseja ativar este contrato?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleWindowsOff}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.activateContract}}/>
      </div>
    )
  }
}