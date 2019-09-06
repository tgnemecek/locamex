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
import Pdf from '/imports/helpers/Pdf/index';

import Box from '/imports/components/Box/index';
import Checkmark from '/imports/components/Checkmark/index';
import AppHeader from '/imports/components/AppHeader/index';
import NotFound from '/imports/components/NotFound/index';
import Loading from '/imports/components/Loading/index';

import SceneHeader from '/imports/components/SceneHeader/index';
import SceneItems from '/imports/components/SceneItems/index';
import SceneFooter from '/imports/components/SceneFooter/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import BillingSchedule from './BillingSchedule/index';
import Information from './Information/index';

class Contract extends React.Component {
  constructor(props) {
    super(props);
    const getDocument = () => {
      if (this.props.contract) {
        var version;
        if (this.props.contract.status === "active") {
          version = this.props.contract.activeVersion;
        } else version = this.props.contract.snapshots.length-1;

        return {
          ...this.props.contract.snapshots[version],
          _id: this.props.contract._id,
          status: this.props.contract.status,
          activeVersion: this.props.contract.activeVersion,
          version,
          proposal: this.props.contract.proposal,
          proposalVersion: this.props.contract.proposalVersion
        }
      } else return null;
    }
    this.state = {
      contract: getDocument() || {
        _id: undefined,
        createdBy: Meteor.user()._id,
        status: "inactive",

        clientId: '',

        version: 0,
        negociatorId: '',
        representativesId: [],

        proposal: '',
        proposalVersion: 0,

        discount: 0,

        observations: {
          internal: '',
          external: ''
        },

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
          deliveryDate: new Date(),
          duration: 1,
          timeUnit: "months"
        },
        containers: [],
        accessories: [],
        services: []
      },
      errorMsg: '',
      errorKeys: [],
      databaseStatus: {}
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.databases !== this.props.databases
      || prevState.contract.version !== this.state.contract.version) {
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
    };
    this.setState({ contract, errorKeys: [], errorMsg: '' }, () => {
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

  changeVersion = (e) => {
    var newVersion = e.target.value;
    var contract = {
      ...this.props.contract.snapshots[newVersion],
      _id: this.state.contract._id,
      status: this.props.contract.status,
      version: newVersion,
      activeVersion: this.props.contract.activeVersion,
      proposal: this.props.contract.proposal,
      proposalVersion: this.props.contract.proposalVersion
    }
    this.setState({ contract });
  }

  cancelContract = (callback) => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      const cancel = (contract) => {
        Meteor.call('contracts.cancel', contract._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Proposta Cancelada!"
            }
            contract.status = "cancelled";
            this.setState({ contract, databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: {status: "failed"} });
            console.log(err);
          }
          callback();
        });
      }
      this.saveEdits(cancel);
    })
  }

  activateContract = (callback) => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      const activate = (contract) => {
        Meteor.call('contracts.activate', contract, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Ativado!"
            }
            contract.status = "active";
            contract.activeVersion = contract.version;
            this.setState({ contract, databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: {status: "failed"} });
            console.log(err);
          }
          callback();
        });
      }
      this.saveEdits(activate);
    })
  }

  finalizeContract = (callback) => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      const finalize = (contract) => {
        Meteor.call('contracts.finalize', contract._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Finalizado!"
            }
            contract.status = "finalized";
            this.setState({ contract, databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: {status: "failed"} });
            console.log(err);
          }
          callback();
        });
      }
      this.saveEdits(finalize);
    })
  }

  saveEdits = (callback) => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      if (this.props.match.params.contractId == 'new') {
        Meteor.call('contracts.insert', this.state.contract, (err, res) => {
          if (res) {
            var contract = {
              ...this.state.contract,
              _id: res
            }
            this.props.history.push("/contract/" + res);
            if (typeof callback === "function") {
              callback(contract);
            } else this.setState({ contract, databaseStatus: {status: "completed"} });
          }
          else if (err) {
            this.setState({ databaseStatus: {status: "failed"} });
            console.log(err);
          }
        });
      } else {
        Meteor.call('contracts.update', this.state.contract, (err, res) => {
          if (res) {
            var contract = {...this.state.contract};
            var databaseStatus = {status: "completed"};
            if (res.hasChanged) {
              contract.version = res.data.snapshots.length-1;
            } else databaseStatus.message = "Nenhuma alteração realizada."

            if (typeof callback === "function") {
              callback(contract);
            } else this.setState({ contract, databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: {status: "failed"} });
            console.log(err);
          }
        });
      }
    })
  }

  generateDocument = () => {
    const generate = (master) => {
      master.type = "contract";
      var pdf = new Pdf(master, this.props.databases);
      pdf.generate().then(() => {
        this.setState({ databaseStatus: {status: "completed"} });
      }).catch((err) => {
        console.log(err);
        this.setState({ databaseStatus: {status: "failed"} });
      })
    }
    this.saveEdits(generate);
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
        <div className="base-scene contract">
          <SceneHeader
            master={{...this.state.contract, type: "contract"}}
            databases={this.props.databases}
            snapshots={this.props.contract ? this.props.contract.snapshots : []}
            changeVersion={this.changeVersion}

            BillingSchedule={BillingSchedule}

            updateMaster={this.updateContract}
            cancelMaster={this.cancelContract}
            saveMaster={this.saveEdits}
            generateDocument={this.generateDocument}

            errorKeys={this.state.errorKeys}
            disabled={disabled}
          />
          <div className={this.state.contract.status !== "inactive" ? "contract__body disable-click" : "contract__body"}>
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
            <DatabaseStatus
              status={this.state.databaseStatus.status}
              message={this.state.databaseStatus.message}/>
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