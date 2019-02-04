import { Meteor } from 'meteor/meteor';
import React from 'react';
import moment from 'moment';
import { Contracts } from '/imports/api/contracts/index';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Checkmark from '/imports/components/Checkmark/index';
import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Loading from '/imports/components/Loading/index';
import ConfirmationWindow from '/imports/components/ConfirmationWindow/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import Activate from './Activate/index';
import Finalize from './Finalize/index';
import Header from './Header/index';
import Information from './Information/index';
import Items from './Items/index';

export default class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: {
        createdBy: Meteor.user() || {username: "Anônimo"},
        status: "inactive",

        client: '',

        negociator: '',
        representatives: [],

        proposal: '',
        discount: 0,

        observations: {
          annotations: '',
          generalObs: '',
          productsObs: '',
          servicesObs: ''
        },

        inss: 11,
        iss: 5,
        billingProducts: [],
        billingServices: [],

        deliveryAddress: {
          street: '',
          cep: '',
          city: '',
          state: 'SP',
          number: '',
          additional: ''
        },
        dates: {
          creationDate: new Date(),
          startDate: new Date(),
          billingDate: new Date(),
          duration: 1
        },
        containers: [],
        accessories: [],
        services: []
      },
      toggleCancelWindow: false,
      toggleActivateWindow: false,
      toggleFinalizeWindow: false,
      errorMsg: '',
      errorKeys: [],
      ready: 0
    }
  }

  componentDidMount() {
    var contract;
    if (this.props.match.params.contractId == 'new') {
      this.setState({ ready: 1 });
    } else {
      this.tracker = Tracker.autorun(() => {
        Meteor.subscribe('contractsPub');
        contract = Contracts.findOne({ _id: this.props.match.params.contractId });
        if (contract) this.setState({ contract, ready: 1 });
      })
    }
    setTimeout(() => {
      if (!contract && this.state.ready == 0) {
        this.setState({ ready: -1 })
      }
    }, 3000);
  }

  componentWillUnmount = () => {
    this.tracker ? this.tracker.stop() : null;
  }

  updateContract = (value, what) => {
    if (Array.isArray(value) && Array.isArray(what)) {
      var contract = {...this.state.contract};
      what.forEach((key, i) => {
        contract[key] = value[i];
      })
      this.setState({ contract });
    } else {
      var contract = {...this.state.contract};
      contract[what] = value;
      this.setState({ contract });
    }
  }

  toggleActivateWindow = () => {
    var toggleActivateWindow = !this.state.toggleActivateWindow;
    if (toggleActivateWindow) {
      var errorKeys = [];
      var errorMsg = 'Campos obrigatórios não preenchidos/inválidos.';

      if (!this.state.contract.client) errorKeys.push("client");
      if (!this.state.contract.proposal) errorKeys.push("proposal");

      if (!this.state.contract.dates.duration) errorKeys.push("duration");

      if (!this.state.contract.deliveryAddress.cep) errorKeys.push("cep");
      if (!this.state.contract.deliveryAddress.street) errorKeys.push("street");
      if (!this.state.contract.deliveryAddress.city) errorKeys.push("city");
      if (!this.state.contract.deliveryAddress.state) errorKeys.push("state");
      if (!this.state.contract.deliveryAddress.number) errorKeys.push("number");

      if (!this.state.contract.billing.length) {
        errorKeys.push("billing");
        errorMsg = 'Favor preencher a Tabela de Cobrança.';
      }

      if (this.totalValue() <= 0) {
        errorKeys.push("totalValue");
        errorMsg = 'O Valor Total do Contrato não pode ser zero.';
      }
      if (errorKeys.length > 0) {
        this.setState({ errorKeys, errorMsg });
      } else this.setState({ toggleActivateWindow, errorKeys, errorMsg: '' });

    } else this.setState({ toggleActivateWindow });
  }

  toggleCancelWindow = () => {
    var toggleCancelWindow = !this.state.toggleCancelWindow;
    this.setState({ toggleCancelWindow });
  }

  toggleFinalizeWindow = () => {
    var toggleFinalizeWindow = !this.state.toggleFinalizeWindow;
    this.setState({ toggleFinalizeWindow });
  }

  cancelContract = () => {
    Meteor.call('contracts.update.one', this.state.contract._id, {status: "cancelled"});
    this.toggleCancelWindow();
  }

  activateContract = () => {
    Meteor.call('contracts.activate', this.state.contract, (err, res) => {
      if (res) {
        var contract = {
          ...this.state.contract,
          status: "active",
          _id: res
        }
        this.props.history.push("/contract/" + res);
        this.setState({ contract });
      }
      else if (err) alert(err.reason);
    });
    this.toggleActivateWindow();
  }

  finalizeContract = (containers, accessories) => {
    Meteor.call('contracts.finalize', this.state.contract._id, containers, accessories, (err, res) => {
      if (res) {
        var contract = {
          ...this.state.contract,
          status: "finalized"
        }
        this.setState({ contract });
      }
      else if (err) alert(err.reason);
    });
    this.toggleFinalizeWindow();
  }

  saveEdits = () => {
    if (this.props.match.params.contractId == 'new') {
      Meteor.call('contracts.insert', this.state.contract, (err, res) => {
        if (res) {
          var contract = {
            ...this.state.contract,
            _id: res
          }
          this.props.history.push("/contract/" + res);
          this.setState({ contract });
        }
        else if (err) console.log(err);
      });
    } else Meteor.call('contracts.update', this.state.contract);
  }

  setDisabledClassName = () => {
    if (this.state.contract.status == 'inactive') {
      return "contract__body";
    } else return "contract__body contract--disabled";
  }

  totalValue = () => {
    var duration = this.state.contract.dates.duration;
    var discount = this.state.contract.discount;

    var containers = this.state.contract.containers || [];
    var accessories = this.state.contract.accessories || [];
    var products = containers.concat(accessories);
    var productsValue = products.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return acc + (current.price * quantity * duration)
    }, 0);
    productsValue = productsValue * (100 - discount) / 100;

    var services = this.state.contract.services || [];
    var servicesValue = services.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return acc + (current.price * quantity)
    }, 0);

    return productsValue + servicesValue;
  }

  render () {
    if (this.state.ready === 1) {
      return (
        <div className="page-content">
          <div className="contract">
            <Header
              toggleCancelWindow={this.toggleCancelWindow}
              contract={this.state.contract}
              updateContract={this.updateContract}
              errorKeys={this.state.errorKeys}
            />
            <div className={this.setDisabledClassName()}>
              <Information
                contract={this.state.contract}
                updateContract={this.updateContract}
                errorKeys={this.state.errorKeys}
              />
              <Items
                contract={this.state.contract}
                updateContract={this.updateContract}
              />
            </div>
            <div className="contract__footer">
              <div className="error-message">{this.state.errorMsg}</div>
              <div className="contract__total-value" style={this.state.errorKeys.includes("totalValue") ? {color: "red"} : null}>
                <h3>Valor Total do Contrato: {tools.format(this.totalValue(), 'currency')}</h3>
              </div>
              {this.state.contract.status === 'inactive' ?
              <FooterButtons buttons={[
                {text: "Salvar Edições", className: "button--secondary", onClick: this.saveEdits},
                {text: "Ativar Contrato", className: "button--primary", onClick: this.toggleActivateWindow},
              ]}/>
              : null}
              {this.state.contract.status === 'active' ?
              <FooterButtons buttons={[
                {text: "Finalizar Contrato", onClick: this.toggleFinalizeWindow},
              ]}/>
              : null}
              <div className="contract__footer-text">Contrato criado dia {moment(this.state.contract.dates.creationDate).format("DD/MM/YYYY")}</div>
              <ConfirmationWindow
                isOpen={this.state.toggleCancelWindow}
                closeBox={this.toggleCancelWindow}
                message="Deseja mesmo cancelar este contrato? Ele não poderá ser reativado."
                leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleCancelWindow}}
                rightButton={{text: "Sim", className: "button--danger", onClick: this.cancelContract}}/>
              <ConfirmationWindow
                isOpen={this.state.toggleActivateWindow}
                closeBox={this.toggleActivateWindow}
                message="Deseja ativar este contrato e locar os itens?"
                leftButton={{text: "Não", className: "button--secondary", onClick: this.toggleActivateWindow}}
                rightButton={{text: "Sim", className: "button--danger", onClick: this.activateContract}}/>
              <Finalize
                isOpen={this.state.toggleFinalizeWindow}
                contract={this.state.contract}
                toggleWindow={this.toggleFinalizeWindow}
                finalizeContract={this.finalizeContract}/>
            </div>
          </div>
        </div>
      )
    } else if (this.state.ready === 0) {
      return <Loading/>
    } else if (this.state.ready === -1) {
      return <NotFound/>
    }
  }
}