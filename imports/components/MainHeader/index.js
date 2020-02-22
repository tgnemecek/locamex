import React from 'react';
import tools from '/imports/startup/tools/index';

import Icon from '/imports/components/Icon/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import Status from '/imports/components/Status/index';
import Input from '/imports/components/Input/index';

import Documents from './Documents/index';

export default class MainHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false,
      cancelWindow: false
    }
  }

  checkIfHasContent = () => {
    var hasContent = (this.props.snapshot.observations.internal || this.props.master.observations.external);
    return hasContent ? "content-inside" : "";
  }

  toggleWindow = (e) => {
    if (e) {
      var windowOpen = e.target.value;
      this.setState({ windowOpen });
    } else this.setState({ windowOpen: false });
  }

  toggleCancelWindow = () => {
    this.setState({
      windowOpen: false,
      cancelWindow: !this.state.cancelWindow
    });
  }

  cancelMaster = () => {
    this.props.cancelMaster(this.toggleCancelWindow);
  }

  snapshotsOptions = () => {
    var snapshots = this.props.snapshots;
    var result = [];
    for (var i = 0; i < snapshots.length; i++) {
      var style = snapshots[i].active ?
        {background: "#77cc77"} : {background: "white"};

      result.unshift((
        <option
          key={i} value={i} style={style}>
            {i + 1}
        </option>
      ))
    }
    return result;


    // this.props.snapshots.reverse().map((item, i, arr) => {
    //   var index = arr.length-i-1;
    //   var label = index + 1;
    //   const style = () => {
    //     if (item.active) {
    //       return {background: "#77cc77"}
    //     } else return {background: "white"}
    //   }
    //   return (
    //     <option
    //       key={i} value={index} style={style()}>
    //         {index + 1}
    //     </option>
    //   )
    // })
  }

  selectStyle = () => {
    if (this.props.snapshots) {
      var snapshot = this.props.snapshots[this.props.snapshotIndex];
      if (snapshot) {
        if (snapshot.active) {
          return {background: "#77cc77"}
        }
      }
    }
    return {background: "white"}
  }

  render() {
      return (
        <div className="main-header">
          <div>
            <div className="main-header__created-by">
              Versão criada por: <strong>{this.props.createdByName}</strong>
            </div>
            <div className="main-header__title">
              <h1>{this.props.title}</h1>
              {this.props.snapshots && this.props.snapshots.length ?
                (this.props.changeSnapshot ?
                <Input
                  onChange={this.props.changeSnapshot}
                  value={this.props.snapshotIndex}
                  style={this.selectStyle()}
                  className="main-header__snapshot-selection"
                  type="select">
                    {this.snapshotsOptions()}
                </Input>
              : <h1>.{this.props.snapshotIndex+1}</h1>) : null}
            </div>
          </div>
          <div className="main-header__right-side">
            {this.props.toggleBilling ?
              <button className="main-header__button"
                onClick={this.props.toggleBilling}>
                <Icon icon="money"
                  style={this.props.billingError
                    ? {color: "red"} : null}/>
              </button>
            : null}
            {this.props.toggleDocuments ?
              <button className="main-header__button"
                onClick={this.props.toggleDocuments}>
                <Icon icon="print"
                style={this.props.documentsError
                  ? {color: "red"} : null}/>
              </button>
            : null}
            {this.props.cancelMaster ?
              <button className="main-header__button"
                onClick={this.toggleCancelWindow}>
                <Icon icon="not"/>
              </button>
            : null}
            <h3>
              Status: <Status
              status={this.props.status}
              type={this.props.type}/>
            </h3>
          </div>
          <ConfirmationWindow
            isOpen={this.state.cancelWindow}
            closeBox={this.toggleCancelWindow}
            message="Deseja cancelar permanentemente este documento? Ele não poderá ser reativado ou editado."
            leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleCancelWindow}}
            rightButton={{text: "Sim", className: "button--danger", onClick: this.cancelMaster}}/>
        </div>
      )
  }
}