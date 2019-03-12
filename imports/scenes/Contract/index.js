import { Meteor } from 'meteor/meteor';
import React from 'react';
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
import Footer from './Footer/index';

export default class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: {
        createdBy: Meteor.user() || {username: "Anônimo"},
        status: "inactive",

        client: '',

        version: 0,
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

  updateContract = (changes, callback) => {
    var contract = {
      ...this.state.contract,
      ...changes
    };
    this.setState({ contract }, () => {
      if (callback) callback();
    })
  }

  setError = (errorMsg, errorKeys) => {
    this.setState({ errorMsg, errorKeys })
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

  totalValue = (option) => {
    var duration = this.state.contract.dates.duration;
    var discount = this.state.contract.discount;

    var containers = this.state.contract.containers || [];
    var accessories = this.state.contract.accessories || [];

    var products = containers.concat(accessories);
    var productsValue = products.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return acc + (current.price * quantity * duration)
    }, 0);
    productsValue = productsValue * (1 - discount);

    var services = this.state.contract.services || [];
    var servicesValue = services.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return acc + (current.price * quantity)
    }, 0);

    if (option === 'products') {
      return productsValue;
    } else if (option === 'services') {
      return servicesValue;
    } else return productsValue + servicesValue;

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
              saveContract={this.saveEdits}
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
            <Footer
              totalValue={this.totalValue()}
              productsValue={this.totalValue('products')}
              servicesValue={this.totalValue('services')}

              setError={this.setError}
              errorMsg={this.state.errorMsg}

              contract={this.state.contract}

              saveEdits={this.saveEdits}
              activateContract={this.activateContract}
              finalizeContract={this.finalizeContract}
            />
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