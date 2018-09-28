import React from 'react';
import Documents from './Documents/index';
import Billing from './Billing/index';
import Observations from './Observations/index';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false
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
    return this.props.contract.observations ? "content-inside" : "";
  }

  toggleWindow = (e) => {
    if (e) {
      e.stopPropagation();
      var windowOpen = e.target.value;
      if (windowOpen == 'documents') {
        if (this.props.contract.clientId == '') return alert("Escolha antes um cliente.");
      }
      this.setState({ windowOpen });
    } else this.setState({ windowOpen: false });
  }

  totalValue = () => {
    var containers = this.props.contract.containers;
    var services = this.props.contract.services;
    var accessories = this.props.contract.accessories;
    return containers.concat(services, accessories);
  }

  render() {
      return (
        <div className="contract__header">
          <div className="contract__overtitle">
            <p>Contrato criado por: <strong>{this.props.contract.createdBy.username}</strong></p>
          </div>
          <div className="contract__top-buttons">
            <button value={'observations'} onClick={this.toggleWindow} className={this.checkIfHasContent()}>⚠</button>
            {this.state.windowOpen == 'observations' ? <Observations
                                              contract={this.props.contract}
                                              toggleWindow={this.toggleWindow}
                                              updateContract={this.props.updateContract}
                                                  /> : null}
            <button value={'documents'} onClick={this.toggleWindow}>⎙</button>
            {this.state.windowOpen == 'documents' ? <Documents
                                              contract={this.props.contract}
                                              toggleWindow={this.toggleWindow}
                                              updateContract={this.props.updateContract}
                                              /> : null}
            <button value={'billing'} onClick={this.toggleWindow} style={this.props.errorKeys.includes("billing") ? {color: "red"} : null}>$</button>
            {this.state.windowOpen == 'billing' ? <Billing
                                              contract={this.props.contract}
                                              toggleWindow={this.toggleWindow}
                                              updateContract={this.props.updateContract}
                                              errorKeys={this.props.errorKeys}
                                              /> : null}
            {this.props.contract.status === "inactive" ?
              <button onClick={this.props.toggleCancelWindow}>✖</button>
            : null}
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