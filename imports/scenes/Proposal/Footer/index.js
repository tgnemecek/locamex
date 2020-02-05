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

  toggleConfirmationWindow = () => {
    this.setState({
      confirmationWindow: !this.state.confirmationWindow
    });
  }

  renderButtons = () => {
    if (this.props.status === 'inactive') {
      return (
        <FooterButtons buttons={[
          {text: "Salvar Edições", className: "button--secondary", onClick: this.props.saveEdits},
          {text: "Fechar Proposta", className: "button--primary", onClick: this.toggleConfirmationWindow},
        ]}/>
      )
    } else return null;
  }

  activateProposal = () => {
    this.props.activateProposal(
      () => this.setState({ confirmationWindow: false })
    )
  }

  render() {
    return (
      <div className="scene-footer">
        <div className="scene-footer__total-value">
          <h3>
            Valor Total: {tools.format(this.props.totalValue, 'currency')}
          </h3>
        </div>
        {this.renderButtons()}
        <div className="scene-footer__text">
          Documento criado dia {moment(this.props.creationDate).format("DD/MM/YYYY")}
        </div>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow}
          closeBox={this.toggleConfirmationWindow}
          message="Deseja fechar esta proposta e transformá-la em contrato?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleConfirmationWindow}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.activateProposal}}/>
      </div>
    )
  }
}