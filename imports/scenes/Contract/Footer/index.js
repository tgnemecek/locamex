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

  toggleFinalizeWindow = () => {
    this.setState({ confirmationWindow: 'finalize' });
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
    } else if (this.props.status === 'active') {
      return (
        <FooterButtons buttons={[
          {text: "Finalizar Contrato", onClick: this.toggleFinalizeWindow}
        ]}/>
      )
    } else return null;
  }

  activateContract = () => {
    this.props.activateContract(() => this.setState({ confirmationWindow: false }))
  }

  finalizeContract = () => {
    this.props.finalizeContract(() => this.setState({ confirmationWindow: false }))
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
        {/* <div className="scene-footer__text">Documento criado dia {moment(this.props.snapshot.dates.creationDate).format("DD/MM/YYYY")}</div> */}
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow === 'finalize'}
          closeBox={this.toggleWindowsOff}
          message="Deseja finalizar este contrato? Ele não poderá ser reativado e todas as cobranças serão finalizadas."
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleWindowsOff}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.props.finalizeContract}}/>
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