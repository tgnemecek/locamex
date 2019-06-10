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
    var errorKeys = [];
    var errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';

    if (!this.props.proposal.clientId) errorKeys.push("clientId");
    if (!this.props.proposal.proposal) errorKeys.push("proposal");

    if (!this.props.proposal.dates.duration) errorKeys.push("duration");

    if (!this.props.proposal.deliveryAddress.cep) errorKeys.push("cep");
    if (!this.props.proposal.deliveryAddress.street) errorKeys.push("street");
    if (!this.props.proposal.deliveryAddress.city) errorKeys.push("city");
    if (!this.props.proposal.deliveryAddress.state) errorKeys.push("state");
    if (!this.props.proposal.deliveryAddress.number) errorKeys.push("number");

    const isBillingCorrect = () => {
      var productsGoalValue = this.props.productsValue;
      var productsValue = this.props.proposal.billingProducts.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      productsValue = tools.round(productsValue, 2);
      if (productsGoalValue !== productsValue) return false;

      var servicesGoalValue = this.props.servicesValue;
      var servicesValue = this.props.proposal.billingServices.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      servicesValue = tools.round(servicesValue, 2);
      if (servicesGoalValue !== servicesValue) return false;
      return true;
    }

    if (!isBillingCorrect()) {
      errorMsg = 'Favor preencher corretamente a Tabela de Cobrança.';
      errorKeys.push("billing");
    }

    if (this.props.totalValue <= 0) {
      errorKeys.push("totalValue");
      errorMsg = 'O Valor Total do Contrato não pode ser zero.';
    }
    if (errorKeys.length > 0) {
      this.props.setError(errorMsg, errorKeys);
    } else {
      this.props.setError('', errorKeys);
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
    if (this.props.proposal.status === 'inactive') {
      return (
        <FooterButtons buttons={[
          {text: "Salvar Edições", className: "button--secondary", onClick: this.props.saveEdits},
          {text: "Ativar Contrato", className: "button--primary", onClick: this.toggleActivateWindow},
        ]}/>
      )
    } else if (this.props.proposal.status === 'active') {
      return (
        <FooterButtons buttons={[
          {text: "Salvar Edições", className: "button--secondary", onClick: this.props.saveEdits},
          {text: "Finalizar Contrato", onClick: this.toggleFinalizeWindow},
        ]}/>
      )
    }
  }

  activateProposal = () => {
    this.props.activateProposal(() => this.setState({ confirmationWindow: false }))
  }

  finalizeProposal = () => {
    this.props.finalizeProposal(() => this.setState({ confirmationWindow: false }))
  }

  render() {
    return (
      <div className="proposal__footer">
        <div className="error-message">{this.props.errorMsg}</div>
        <div className="proposal__total-value">
          <h3>Valor Total do Contrato: {tools.format(this.props.totalValue, 'currency')}</h3>
        </div>
        {this.renderButtons()}
        <div className="proposal__footer-text">Contrato criado dia {moment(this.props.proposal.dates.creationDate).format("DD/MM/YYYY")}</div>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow === 'finalize'}
          closeBox={this.toggleWindowsOff}
          message="Deseja finalizar este contrato? Ele não poderá ser reativado."
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleWindowsOff}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.props.finalizeProposal}}/>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow === 'activate'}
          closeBox={this.toggleWindowsOff}
          message="Deseja ativar este contrato?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleWindowsOff}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.activateProposal}}/>
      </div>
    )
  }
}


