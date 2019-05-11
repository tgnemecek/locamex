import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Contracts } from '/imports/api/contracts/index';
import { Clients } from '/imports/api/clients/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import { Accessories } from '/imports/api/accessories/index';
import { Services } from '/imports/api/services/index';

import RedirectUser from '/imports/components/RedirectUser/index';
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

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: {
        createdBy: Meteor.user() || {username: "Anônimo"},
        status: "inactive",

        clientId: '',

        version: 0,
        negociatorId: '',
        representativesId: [],

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
    if (!this.props.match.params.contractId == 'new') {
      this.setContract();
    }
  }

  componentDidUpdate(prevProps) {
    this.setContract();
    this.setUpdatedItemInformation();
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.match.params.contractId !== this.props.match.params.contractId) {
  //     this.setContract();
  //   }
  //   if (prevProps.databases !== this.props.databases) {
  //     this.setUpdatedItemInformation();
  //   }
  // }

  setContract = () => {
    var contract = this.props.databases.contractsDatabase.find((element) => {
      return element._id === this.props.match.params.contractId;
    })
    if (contract) this.setState({ contract });
  }

  setUpdatedItemInformation = () => {
    var contract = { ...this.state.contract };
    var arrayOfArrays = [contract.containers, contract.accessories, contract.services];
    arrayOfArrays.forEach((itemArray) => {
      itemArray.forEach((item) => {
        var database;
        switch (item.type) {
          case 'modular':
          case 'fixed':
            database = this.props.databases.containersDatabase;
            break;
          case 'accessory':
            database = this.props.databases.accessoriesDatabase;
            break;
          case 'service':
            database = this.props.databases.servicesDatabase;
            break;
          default:
            throw new Meteor.Error('type-not-found');
        }
        var productFromDatabase = tools.findUsingId(database, item.productId);
        item.description = productFromDatabase.description;
        item.restitution = productFromDatabase.restitution;
      })
    })
    this.setState({ contract });
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

  activateContract = (callback) => {
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
    callback();
  }

  finalizeContract = (callback) => {
    Meteor.call('contracts.finalize', this.state.contract, (err, res) => {
      if (res) {
        var contract = {
          ...this.state.contract,
          status: "finalized",
          _id: res
        }
        this.props.history.push("/contract/" + res);
        this.setState({ contract });
      }
      else if (err) alert(err.reason);
    });
    callback();
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
      var renting = current.renting || 1;
      return acc + (current.price * renting * duration)
    }, 0);
    productsValue = productsValue * (1 - discount);

    var services = this.state.contract.services || [];
    var servicesValue = services.reduce((acc, current) => {
      var renting = current.renting ? current.renting : 1;
      return acc + (current.price * renting)
    }, 0);

    if (option === 'products') {
      return productsValue;
    } else if (option === 'services') {
      return servicesValue;
    } else return productsValue + servicesValue;

  }

  render () {
    if (this.props.ready) {
      return (
        <div className="page-content">
          <RedirectUser currentPage="contract"/>
          <div className="contract">
            <Header
              databases={this.props.databases}
              toggleCancelWindow={this.toggleCancelWindow}
              contract={this.state.contract}
              updateContract={this.updateContract}
              errorKeys={this.state.errorKeys}
              saveContract={this.saveEdits}
            />
            <div className={this.setDisabledClassName()}>
              <Information
                clientsDatabase={this.props.databases.clientsDatabase}
                contract={this.state.contract}
                updateContract={this.updateContract}
                errorKeys={this.state.errorKeys}
              />
              <Items
                databases={this.props.databases}
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
    } else if (!this.props.ready) {
      return <Loading/>
    }
  }
}

export default ContractWrapper = withTracker((props) => {
  Meteor.subscribe('contractsPub');
  Meteor.subscribe('clientsPub');

  Meteor.subscribe('placesPub');

  Meteor.subscribe('containersPub');
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('servicesPub');

  var databases = {
    contractsDatabase: Contracts.find().fetch(),
    clientsDatabase: Clients.find().fetch(),

    placesDatabase: Places.find().fetch(),

    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch()

  }
  var contract = {};
  if (!this.props.match.params.contractId == 'new') {
    contract = Containers.findOne({_id: this.props.match.params.contractId});
  }
  return { databases, contract }

})(Contract);















