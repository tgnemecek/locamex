import React from 'react';
import Documents from './Documents/index';
import Billing from './Billing/index';
import Observations from './Observations/index';
import Button from '/imports/components/Button/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false,
      cancelWindow: false
    }
  }

  statusToJSX = () => {
    switch (this.props.proposal.status) {
      case "active":
        return <span className="proposal--active">Ativo</span>
      case "inactive":
        return <span className="proposal--inactive">Inativo</span>
      case "cancelled":
        return <span className="proposal--cancelled">Cancelado</span>
      case "finalized":
        return <span className="proposal--finalized">Finalizado</span>
      case "prorogation":
        return <span className="proposal--prorogation">Em Prorrogação</span>
      default:
        return "-";
    }
  }

  checkIfHasContent = () => {
    var hasContent = (this.props.proposal.observations.internal || this.props.proposal.observations.external);
    return hasContent ? "content-inside" : "";
  }

  toggleWindow = (e) => {
    if (e) {
      var windowOpen = e.target.value;
      if (windowOpen == 'documents') {
        if (this.props.proposal.clientId == '') return alert("Escolha antes um cliente.");
        if (!this.props.proposal.billingProducts.length && !this.props.proposal.billingServices.length) {
          return alert("Preencha antes a Tabela de Cobrança.");
        }
      }
      this.setState({ windowOpen });
    } else this.setState({ windowOpen: false });
  }

  showCancelButton = () => {
    if (this.props.proposal.status === "inactive" && this.props.proposal._id) {
      return <Button onClick={this.toggleCancelWindow} icon="not" />
    } else return null;
  }

  toggleCancelWindow = () => {
    this.setState({ windowOpen: false, cancelWindow: !this.state.cancelWindow });
  }

  cancelProposal = () => {
    this.props.cancelProposal(this.toggleCancelWindow);
  }

  render() {
      return (
        <div className="proposal__header">
          <div className="proposal__overtitle">
            <p>Proposta criada por: <strong>{this.props.proposal.createdBy.username}</strong></p>
          </div>
          <div className="proposal__top-buttons">
            <Button value='observations' onClick={this.toggleWindow} className={this.checkIfHasContent()} icon="warning"/>
            {this.state.windowOpen == 'observations' ? <Observations
                                              proposal={this.props.proposal}
                                              toggleWindow={this.toggleWindow}
                                              updateProposal={this.props.updateProposal}
                                                  /> : null}
            <Button value='billing' onClick={this.toggleWindow} icon="money"
              style={this.props.errorKeys.includes("billing") ? {color: "red"} : null}
            />
            {this.state.windowOpen == 'billing' ? <Billing
                                              proposal={this.props.proposal}
                                              toggleWindow={this.toggleWindow}
                                              updateProposal={this.props.updateProposal}
                                              errorKeys={this.props.errorKeys}
                                              /> : null}
            <Button value='documents' onClick={this.toggleWindow} icon="print"/>
            {this.state.windowOpen == 'documents' ? <Documents
                                              databases={this.props.databases}
                                              saveProposal={this.props.saveProposal}
                                              proposal={this.props.proposal}
                                              toggleWindow={this.toggleWindow}
                                              updateProposal={this.props.updateProposal}
                                              /> : null}
            {this.showCancelButton()}
            <ConfirmationWindow
              isOpen={this.state.cancelWindow}
              closeBox={this.toggleCancelWindow}
              message="Deseja cancelar este contrato? Ele não poderá ser reativado ou editado."
              leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleCancelWindow}}
              rightButton={{text: "Sim", className: "button--danger", onClick: this.cancelProposal}}/>
          </div>
          <div className="proposal__title">
            <h1>Proposta #{this.props.proposal._id}</h1>
          </div>
          <div className="proposal__subtitle">
            <h3>Status: {this.statusToJSX()}</h3>
          </div>
        </div>
      )
  }
}