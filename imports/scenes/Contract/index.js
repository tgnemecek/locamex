import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Redirect } from 'react-router';
import moment from 'moment';

import { Contracts } from '/imports/api/contracts/index';
import tools from '/imports/startup/tools/index';
import Box from '/imports/components/Box/index';
import Checkmark from '/imports/components/Checkmark/index';
import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Loading from '/imports/components/Loading/index';
import Header from './Header/index';
import Information from './Information/index';
import Items from './Items/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Contract extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contract: {},
      toggleCancelWindow: false,
      toggleActivateWindow: false,
      ready: 0
    }
  }

  componentDidMount() {
    var contract;
    if (this.props.params.contractId == 'new') {
    } else {
      this.tracker = Tracker.autorun(() => {
        Meteor.subscribe('contractsPub');
        contract = Contracts.findOne({ _id: this.props.params.contractId });
        if (contract) this.setState({ contract, ready: 1 });
      })
    }
    setTimeout(() => {if (!contract) this.setState({ ready: -1 })}, 3000);
  }

  updateContract = (value, what) => {
    var contract = {...this.state.contract};
    contract[what] = value;
    this.setState({ contract });
  }

  toggleActivateWindow = () => {
    var toggleActivateWindow = !this.state.toggleActivateWindow;
    this.setState({ toggleActivateWindow });
  }

  toggleCancelWindow = () => {
    var toggleCancelWindow = !this.state.toggleCancelWindow;
    this.setState({ toggleCancelWindow });
  }

  cancelContract = () => {
    Meteor.call('contracts.cancel', this.state.contract._id, (err, res) => {
      this.props.router.push('/database/contracts');
    });
  }

  activateContract = () => {
    Meteor.call('contracts.activate', this.state.contract._id);
    this.toggleActivateWindow();
  }

  saveEdits = () => {
    if (this.props.params.contractId == 'new') {
      Meteor.call('contracts.insert', this.state.contract);
    } else Meteor.call('contracts.update', this.state.contract);
  }

  setDisabledClassName = () => {
    if (this.state.contract.status == 'cancelled' ||
        this.state.contract.status == 'active') {
      return "contract__body contract--disabled";
    } else return "contract__body";
  }

  totalValue = () => {
    var containers = this.state.contract.containers;
    var services = this.state.contract.services;
    var accessories = this.state.contract.accessories;
    var all = containers.concat(services, accessories);
    if (all.length == 0) return 0;
    return all.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return {
        price: acc.price + (current.price * quantity)
      }
    }).price;
  }

  render () {
    if (this.state.ready === 1) {
      return (
        <>
          <AppHeader title="Contrato"/>
          <div className="page-content">
            <div className="contract">
              <Header
                toggleCancelWindow={this.toggleCancelWindow}
                contract={this.state.contract}
                updateContract={this.updateContract}
              />
              <div className={this.setDisabledClassName()}>
                <Information
                  contract={this.state.contract}
                  updateContract={this.updateContract}
                />
                <Items
                  contract={this.state.contract}
                  updateContract={this.updateContract}
                />
                <div>
                  <div className="contract__total-value">
                    <h3>Valor Total do Contrato: {tools.format(this.totalValue(), 'currency')}</h3>
                  </div>
                  {this.state.contract.status === 'inactive' ?
                  <FooterButtons buttons={[
                    {text: "Salvar Edições", className: "button--secondary", onClick: () => this.saveEdits()},
                    {text: "Ativar Contrato", className: "button--primary", onClick: () => this.toggleActivateWindow()},
                  ]}/>
                  : null}
                  <div className="contract__footer-text">Contrato criado dia 12/12/2018</div>
                  {this.state.toggleCancelWindow ?
                    <Box
                      title="Aviso:"
                      closeBox={this.toggleCancelWindow}>
                      <p>Deseja mesmo cancelar este contrato? Ele não poderá ser reativado.</p>
                      <FooterButtons buttons={[
                        {text: "Não", className: "button--secondary", onClick: () => this.toggleCancelWindow()},
                        {text: "Sim", className: "button--danger", onClick: () => this.cancelContract()}
                      ]}/>
                    </Box>
                  : null}
                  {this.state.toggleActivateWindow ?
                    <Box
                      title="Aviso:"
                      closeBox={this.toggleActivateWindow}>
                      <p>Deseja ativar este contrato e locar os itens?</p>
                      <FooterButtons buttons={[
                        {text: "Não", className: "button--secondary", onClick: () => this.toggleActivateWindow()},
                        {text: "Sim", onClick: () => this.activateContract()}
                      ]}/>
                    </Box>
                  : null}
                </div>
              </div>
            </div>
          </div>
        </>
      )
    } else if (this.state.ready === 0) {
      return (
        <>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <Loading fullPage={true}/>
          </div>
        </>
      )
    } else if (this.state.ready === -1) {
      return (
        <>
        <AppHeader title="Contrato"/>
          <div className="page-content">
            <NotFound/>
          </div>
        </>
      )
    }
  }
}