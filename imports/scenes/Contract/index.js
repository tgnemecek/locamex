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
import Finalize from './Finalize/index';
import Header from './Header/index';
import Information from './Information/index';
import Items from './Items/index';
import FooterButtons from '/imports/components/FooterButtons/index';

export default class Contract extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contract: {
        createdBy: Meteor.user() || {username: "Anônimo"},
        status: "inactive",

        clientId: '',

        billing: [],
        deliveryAddress: {
          street: '',
          cep: '',
          city: '',
          state: '',
          number: '',
          additional: ''
        },
        dates: {
          creationDate: new Date(),
          startDate: new Date(),
          duration: 1
        },
        containers: [],
        accessories: [],
        services: []
      },
      toggleCancelWindow: false,
      toggleActivateWindow: false,
      toggleFinalizeWindow: false,
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
    this.setState({ toggleActivateWindow });
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
    Meteor.call('contracts.cancel', this.state.contract._id);
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
      else if (err) console.log(err);
    });
    this.toggleActivateWindow();
  }

  finalizeContract = (products) => {
    Meteor.call('contracts.finalize', this.state.contract._id, products, (err, res) => {
      if (res) {
        var contract = {
          ...this.state.contract,
          status: "finalized"
        }
        this.setState({ contract });
      }
      else if (err) console.log(err);
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
    var containers = this.state.contract.containers || [];
    var services = this.state.contract.services || [];
    var accessories = this.state.contract.accessories || [];
    var all = [].concat(containers, services, accessories);
    if (all.length == 0) return 0;
    return all.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return acc + (current.price * quantity)
    }, 0);
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
            </div>
            <div className="contract__footer">
              <div className="contract__total-value">
                <h3>Valor Total do Contrato: {tools.format(this.totalValue(), 'currency')}</h3>
              </div>
              {this.state.contract.status === 'inactive' ?
              <FooterButtons buttons={[
                {text: "Salvar Edições", className: "button--secondary", onClick: () => this.saveEdits()},
                {text: "Ativar Contrato", className: "button--primary", onClick: () => this.toggleActivateWindow()},
              ]}/>
              : null}
              {this.state.contract.status === 'active' ?
              <FooterButtons buttons={[
                {text: "Finalizar Contrato", onClick: () => this.toggleFinalizeWindow()},
              ]}/>
              : null}
              <div className="contract__footer-text">Contrato criado dia {moment(this.state.contract.dates.creationDate).format("DD/MM/YYYY")}</div>
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
              {this.state.toggleFinalizeWindow ?
                <Finalize
                  contract={this.state.contract}
                  toggleWindow={this.toggleFinalizeWindow}
                  finalizeContract={this.finalizeContract}/>
              : null}
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