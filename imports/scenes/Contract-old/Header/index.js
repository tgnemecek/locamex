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
    switch (this.props.contract.status) {
      case "active":
        return <span className="contract--active">Ativo</span>
      case "inactive":
        return <span className="contract--inactive">Inativo</span>
      case "cancelled":
        return <span className="contract--cancelled">Cancelado</span>
      case "finalized":
        return <span className="contract--finalized">Finalizado</span>
      case "prorogation":
        return <span className="contract--prorogation">Em Prorrogação</span>
      default:
        return "-";
    }
  }

  checkIfHasContent = () => {
    var hasContent = (this.props.contract.observations.internal || this.props.contract.observations.external);
    return hasContent ? "content-inside" : "";
  }

  toggleWindow = (e) => {
    if (e) {
      var windowOpen = e.target.value;
      if (windowOpen == 'documents') {
        if (this.props.contract.clientId == '') return alert("Escolha antes um cliente.");
        if (!this.props.contract.billingProducts.length && !this.props.contract.billingServices.length) {
          return alert("Preencha antes a Tabela de Cobrança.");
        }
      }
      this.setState({ windowOpen });
    } else this.setState({ windowOpen: false });
  }

  showCancelButton = () => {
    if (this.props.contract.status === "inactive" && this.props.contract._id) {
      return <Button onClick={this.toggleCancelWindow} icon="not" />
    } else return null;
  }

  toggleCancelWindow = () => {
    this.setState({ windowOpen: false, cancelWindow: !this.state.cancelWindow });
  }

  cancelContract = () => {
    this.props.cancelContract(this.toggleCancelWindow);
  }

  render() {
      return (
        <div className="contract__header">
          <div className="contract__overtitle">
            <p>Contrato criado por: <strong>{this.props.contract.createdBy.username}</strong></p>
          </div>
          <div className="contract__top-buttons">
            <Button value='observations' onClick={this.toggleWindow} className={this.checkIfHasContent()} icon="warning"/>
            {this.state.windowOpen == 'observations' ? <Observations
                                              contract={this.props.contract}
                                              toggleWindow={this.toggleWindow}
                                              updateContract={this.props.updateContract}
                                                  /> : null}
            <Button value='billing' onClick={this.toggleWindow} icon="money"
              style={this.props.errorKeys.includes("billing") ? {color: "red"} : null}
            />
            {this.state.windowOpen == 'billing' ? <Billing
                                              contract={this.props.contract}
                                              toggleWindow={this.toggleWindow}
                                              updateContract={this.props.updateContract}
                                              errorKeys={this.props.errorKeys}
                                              /> : null}
            <Button value='documents' onClick={this.toggleWindow} icon="print"/>
            {this.state.windowOpen == 'documents' ? <Documents
                                              databases={this.props.databases}
                                              saveContract={this.props.saveContract}
                                              contract={this.props.contract}
                                              toggleWindow={this.toggleWindow}
                                              updateContract={this.props.updateContract}
                                              /> : null}
            {this.showCancelButton()}
            <ConfirmationWindow
              isOpen={this.state.cancelWindow}
              closeBox={this.toggleCancelWindow}
              message="Deseja cancelar este contrato? Ele não poderá ser reativado ou editado."
              leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleCancelWindow}}
              rightButton={{text: "Sim", className: "button--danger", onClick: this.cancelContract}}/>
          </div>
          <div className="contract__title">
            <h1>Contrato #{this.props.contract._id}</h1>
          </div>
          <div className="contract__subtitle">
            <h3>Status: {this.statusToJSX()}</h3>
          </div>
        </div>
      )
  }
}