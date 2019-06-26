import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Contracts } from '/imports/api/contracts/index';
import { Clients } from '/imports/api/clients/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import { Accessories } from '/imports/api/accessories/index';
import { Services } from '/imports/api/services/index';
import { Users } from '/imports/api/users/index';

import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Checkmark from '/imports/components/Checkmark/index';
import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Loading from '/imports/components/Loading/index';

import SceneHeader from '/imports/components/SceneHeader/index';
import SceneItems from '/imports/components/SceneItems/index';
import SceneFooter from '/imports/components/SceneFooter/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import Information from './Information/index';

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contract: this.props.contract || {
        _id: undefined,
        createdBy: Meteor.user()._id,
        status: "inactive",

        clientId: '',

        version: 1,
        negociatorId: '',
        representativesId: [],

        proposal: '',
        proposalVersion: 1,

        discount: 0,

        observations: {
          internal: '',
          external: ''
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
          duration: 1,
          timeUnit: "months"
        },
        containers: [],
        accessories: [],
        services: []
      },
      errorMsg: '',
      errorKeys: [],
      databaseStatus: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.databases !== this.props.databases) {
      this.setUpdatedItemInformation();
    }
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
      ...changes,
      errorKeys: [],
      errorMsg: ''
    };
    this.setState({ contract }, () => {
      if (typeof (callback) === "function") callback();
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

  cancelContract = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.cancel', this.state.contract, (err, res) => {
        if (res) {
          var contract = {
            ...this.state.contract,
            status: "cancelled",
            _id: res
          }
          this.setState({ contract, databaseStatus: "completed" });
        } else if (err) this.setState({ databaseStatus: "failed" });
      });
      if (typeof (callback) === "function") callback();
    })
  }

  activateContract = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.activate', this.state.contract, (err, res) => {
        if (res) {
          var contract = {
            ...this.state.contract,
            status: "active",
            _id: res
          }
          this.setState({ contract, databaseStatus: "completed" });
        } else if (err) this.setState({ databaseStatus: "failed" });
      });
      if (typeof (callback) === "function") callback();;
    })
  }

  finalizeContract = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      Meteor.call('contracts.finalize', this.state.contract, (err, res) => {
        if (res) {
          var contract = {
            ...this.state.contract,
            status: "finalized",
            _id: res
          }
          this.props.history.push("/contract/" + res);
          this.setState({ contract, databaseStatus: "completed" });
        } else if (err) this.setState({ databaseStatus: "failed" });
      });
      if (typeof (callback) === "function") callback();
    })
  }

  saveEdits = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      if (this.props.match.params.contractId == 'new') {
        Meteor.call('contracts.insert', this.state.contract, (err, res) => {
          if (res) {
            var contract = {
              ...this.state.contract,
              _id: res
            }
            this.props.history.push("/contract/" + res);
            this.setState({ contract, databaseStatus: "completed" });
          }
          else if (err) this.setState({ databaseStatus: "failed" });
        });
      } else {
        Meteor.call('contracts.update', this.state.contract, (err, res) => {
          if (res) {
            if (res.hasChanged) {
              var contract = {...this.state.contract};
              contract.version++;
              this.setState({ databaseStatus: "completed", contract });
            } else this.setState({ databaseStatus: "completed"});
          }
          else if (err) this.setState({ databaseStatus: "failed" });
        });
      }
      if (typeof (callback) === "function") callback();
    })
  }

  totalValue = (option) => {
    var duration = this.state.contract.dates.timeUnit === "months" ? this.state.contract.dates.duration : 1;
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
    var disabled = this.state.contract.status === "cancelled";
    return (
      <div className="page-content">
        {/* <RedirectUser currentPage="contract"/> */}
        <div className="contract">
          <SceneHeader
            master={{...this.state.contract, type: "contract"}}
            databases={this.props.databases}

            updateMaster={this.updateContract}
            cancelMaster={this.cancelContract}
            saveMaster={this.saveEdits}

            errorKeys={this.state.errorKeys}
            disabled={disabled}
          />
          <div className={disabled ? "disable-click" : ""}>
            <Information
              clientsDatabase={this.props.databases.clientsDatabase}
              contract={this.state.contract}
              updateContract={this.updateContract}
              errorKeys={this.state.errorKeys}
            />
            <SceneItems
              master={this.state.contract}
              databases={this.props.databases}
              updateMaster={this.updateContract}
            />
            <SceneFooter
              totalValue={this.totalValue()}
              productsValue={this.totalValue('products')}
              servicesValue={this.totalValue('services')}

              setError={this.setError}
              errorMsg={this.state.errorMsg}

              master={{...this.state.contract, type: "contract"}}

              saveEdits={this.saveEdits}
              activateMaster={this.activateContract}
              finalizeMaster={this.finalizeContract}
            />
            <DatabaseStatus status={this.state.databaseStatus} />
          </div>
        </div>
      </div>
    )
  }
}

function ContractLoader (props) {
  if (props.match.params.contractId === 'new' || props.contract) {
    return <Contract {...props} />
  } else return null;
}

export default ContractWrapper = withTracker((props) => {
  Meteor.subscribe('contractsPub');
  Meteor.subscribe('clientsPub');

  Meteor.subscribe('placesPub');

  Meteor.subscribe('containersPub');
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('servicesPub');

  Meteor.subscribe('usersPub');

  var databases = {
    contractsDatabase: Contracts.find().fetch(),
    clientsDatabase: Clients.find().fetch(),

    placesDatabase: Places.find().fetch(),

    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch(),

    usersDatabase: Meteor.users.find().fetch()

  }
  var contract = undefined;
  if (props.match.params.contractId !== 'new') {
    contract = Contracts.findOne({ _id: props.match.params.contractId });
  }
  return { databases, contract }

})(ContractLoader);