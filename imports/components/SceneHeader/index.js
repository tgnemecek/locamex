import React from 'react';
import Documents from './Documents/index';
import Billing from './Billing/index';
import Observations from './Observations/index';
import Button from '/imports/components/Button/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import Status from '/imports/components/Status/index';

export default class SceneHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false,
      cancelWindow: false
    }
  }

  renderTitle = () => {
    var label;
    if (this.props.master.type === "proposal") {
      label = "Proposta";
    } else label = "Contrato";
    return (
      <div className="master__title">
        <h1>{`${label} #${this.props.master._id || ''}.${this.props.master.version}`}</h1>
      </div>
    )
  }

  renderCreatedBy = () => {
    var user = this.props.databases.usersDatabase.find((item) => {
      return (item._id === this.props.master.createdBy)
    })
    var name = user ? user.firstName + " " + user.lastName : "anônimo";
    return (
      <div className="master__overtitle">
        <p>Documento criado por: <strong>{name}</strong></p>
      </div>
    )
  }

  checkIfHasContent = () => {
    var hasContent = (this.props.master.observations.internal || this.props.master.observations.external);
    return hasContent ? "content-inside" : "";
  }

  toggleWindow = (e) => {
    if (e) {
      var windowOpen = e.target.value;
      this.setState({ windowOpen });
    } else this.setState({ windowOpen: false });
  }

  showDocumentsButton = () => {
    const requirements = (e) => {
      if (this.props.master.type === "contract") {
        if (this.props.master.clientId == '') {
          return alert("Escolha antes um cliente.");
        }
        if (!this.props.master.billingProducts.length &&
            !this.props.master.billingServices.length) {
          return alert("Preencha antes a Tabela de Cobrança.");
        }
        this.toggleWindow(e);
      } else if (this.props.master.type === "proposal") {
        if (!this.props.master.containers.length && !this.props.master.accessories.length) {
          return alert("Adicione algum produto!");
        }
        new Documents().quickGenerate(this.props);
      }
    }
    const renderDocuments = () => {
      if (this.state.windowOpen === "documents") {
        return (
          <Documents
            databases={this.props.databases}
            saveMaster={this.props.saveMaster}
            master={this.props.master}
            toggleWindow={this.toggleWindow}
            updateMaster={this.props.updateMaster}/>
        )
      } else return null;
    }

    if (this.props.master.type !== "shipping") {
      return (
        <>
          <Button value="documents" onClick={requirements} icon="print"/>
          {renderDocuments()}
        </>
      )
    } else return null;
  }

  showCancelButton = () => {
    if (this.props.master.status === "inactive" && this.props.master._id) {
      return <Button onClick={this.toggleCancelWindow} icon="not" />
    } else return null;
  }

  toggleCancelWindow = () => {
    this.setState({ windowOpen: false, cancelWindow: !this.state.cancelWindow });
  }

  cancelMaster = () => {
    this.props.cancelMaster(this.toggleCancelWindow);
  }

  render() {
      return (
        <div className="master__header">
          {this.renderCreatedBy()}
          <div className="master__top-buttons">
            <Button value='observations' onClick={this.toggleWindow} className={this.checkIfHasContent()} icon="warning"/>
            {this.state.windowOpen == 'observations' ? <Observations
                                              master={this.props.master}
                                              toggleWindow={this.toggleWindow}
                                              updateMaster={this.props.updateMaster}
                                              disabled={this.props.disabled}
                                                  /> : null}
            {this.props.master.type === "contract" ?
            <Button value='billing' onClick={this.toggleWindow} icon="money"
              style={this.props.errorKeys.includes("billing") ? {color: "red"} : null}/>
            : null}
            {this.state.windowOpen == 'billing' ? <Billing
                                              master={this.props.master}
                                              toggleWindow={this.toggleWindow}
                                              updateMaster={this.props.updateMaster}
                                              errorKeys={this.props.errorKeys}
                                              /> : null}
            {this.showDocumentsButton()}
            {this.showCancelButton()}
            <ConfirmationWindow
              isOpen={this.state.cancelWindow}
              closeBox={this.toggleCancelWindow}
              message="Deseja cancelar permanentemente este documento? Ele não poderá ser reativado ou editado."
              leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleCancelWindow}}
              rightButton={{text: "Sim", className: "button--danger", onClick: this.cancelMaster}}/>
          </div>
          {this.renderTitle()}
          <div className="master__subtitle">
            <h3>Status: <Status status={this.props.master.status} type={this.props.master.type}/></h3>
          </div>
        </div>
      )
  }
}