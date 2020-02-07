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

    if (!this.props.snapshot.client._id) errorKeys.push("client");
    if (!this.props.snapshot.dates.duration) errorKeys.push("duration");

    if (!this.props.snapshot.deliveryAddress.cep) errorKeys.push("cep");
    if (!this.props.snapshot.deliveryAddress.street) errorKeys.push("street");
    if (!this.props.snapshot.deliveryAddress.city) errorKeys.push("city");
    if (!this.props.snapshot.deliveryAddress.state) errorKeys.push("state");
    if (!this.props.snapshot.deliveryAddress.number) errorKeys.push("number");

    const isBillingCorrect = () => {
      if (!this.props.snapshot.billingProducts.length) return false;
      if (!this.props.snapshot.billingServices.length) return false;

      var productsGoalValue = this.props.productsValue;
      var productsValue = this.props.snapshot.billingProducts.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      productsValue = tools.round(productsValue, 2);
      if (productsGoalValue !== productsValue) return false;

      var servicesGoalValue = this.props.servicesValue;
      var servicesValue = this.props.snapshot.billingServices.reduce((acc, cur) => {
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
    if (this.props.status === 'inactive') {
      return (
        <FooterButtons buttons={[
          {text: "Salvar Edições", className: "button--secondary", onClick: this.props.saveEdits},
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

  activateSnapshot = () => {
    this.props.activateSnapshot(() => this.setState({ confirmationWindow: false }))
  }

  finalizeSnapshot = () => {
    this.props.finalizeSnapshot(() => this.setState({ confirmationWindow: false }))
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
          rightButton={{text: "Sim", className: "button--danger", onClick: this.props.finalizeSnapshot}}/>
        <ConfirmationWindow
          isOpen={this.state.confirmationWindow === 'activate'}
          closeBox={this.toggleWindowsOff}
          message="Deseja ativar este contrato?"
          leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleWindowsOff}}
          rightButton={{text: "Sim", className: "button--danger", onClick: this.activateSnapshot}}/>
      </div>
    )
  }
}