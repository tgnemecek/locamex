import React from 'react';
import moment from 'moment';

import tools from '/imports/startup/tools/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class SceneFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmationWindow: false
    }
  }

  toggleActivateWindow = () => {
    var errorKeys = [];
    var errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';

    if (this.props.master.type === "contract") {
      if (!this.props.master.clientId) errorKeys.push("clientId");
      if (!this.props.master.proposal) errorKeys.push("proposal");

      if (!this.props.master.dates.duration) errorKeys.push("duration");

      if (!this.props.master.deliveryAddress.cep) errorKeys.push("cep");
      if (!this.props.master.deliveryAddress.street) errorKeys.push("street");
      if (!this.props.master.deliveryAddress.city) errorKeys.push("city");
      if (!this.props.master.deliveryAddress.state) errorKeys.push("state");
      if (!this.props.master.deliveryAddress.number) errorKeys.push("number");
    }

    const isBillingCorrect = () => {
      if (this.props.master.type === "proposal") return true;
      if (!this.props.master.billingProducts) return false;
      if (!this.props.master.billingServices) return false;

      var productsGoalValue = this.props.productsValue;
      var productsValue = this.props.master.billingProducts.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      productsValue = tools.round(productsValue, 2);
      if (productsGoalValue !== productsValue) return false;

      var servicesGoalValue = this.props.servicesValue;
      var servicesValue = this.props.master.billingServices.reduce((acc, cur) => {
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
      errorMsg = 'O Valor Total não pode ser zero.';
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
    if (this.props.master.status === 'inactive') {
      var activeText = this.props.master.type === "contract" ? "Ativar Contrato" : "Fechar Proposta";
      return (
        <FooterButtons buttons={[
          {text: "Salvar Edições", className: "button--secondary", onClick: this.props.saveEdits},
          {text: activeText, className: "button--primary", onClick: this.toggleActivateWindow},
        ]}/>
      )
    } else if (this.props.master.status === 'active' && this.props.master.type === "contract") {
      return (
        <FooterButtons buttons={[
          {text: "Salvar Edições", className: "button--secondary", onClick: this.props.saveEdits},
          {text: "Finalizar Contrato", onClick: this.toggleFinalizeWindow},
        ]}/>
      )
    } else return null;
  }

  activateMaster = () => {
    this.props.activateMaster(() => this.setState({ confirmationWindow: false }))
  }

  finalizeMaster = () => {
    this.props.finalizeMaster(() => this.setState({ confirmationWindow: false }))
  }

  render() {
    return (
      <div className="scene-footer">
        <div className="error-message">{this.props.errorMsg}</div>
        <div className="scene-footer__total-value">
          <h3>Valor Total: {tools.format(this.props.totalValue, 'currency')}</h3>
        </div>
        {this.renderButtons()}
        <div className="scene-footer__text">Documento criado dia {moment(this.props.master.dates.creationDate).format("DD/MM/YYYY")}</div>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow === 'finalize'}
          closeBox={this.toggleWindowsOff}
          message="Deseja finalizar este contrato? Ele não poderá ser reativado."
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleWindowsOff}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.props.finalizeMaster}}/>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow === 'activate'}
          closeBox={this.toggleWindowsOff}
          message={this.props.master.type === "contract" ? "Deseja ativar este contrato?"
          : "Deseja fechar esta proposta e transformá-la em contrato?"}
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleWindowsOff}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.activateMaster}}/>
      </div>
    )
  }
}


