import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Accounts } from '/imports/api/accounts/index';
import { Contracts } from '/imports/api/contracts/index';
import { Proposals } from '/imports/api/proposals/index';
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

import MainHeader from '/imports/components/MainHeader/index';
import MainItems from '/imports/components/MainItems/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import ClientSetup from './ClientSetup/index';
import BillingSchedule from './BillingSchedule/index';
import Documents from './Documents/index';
import Information from './Information/index';
import Footer from './Footer/index';

class Contract extends React.Component {
  constructor(props) {
    super(props);
    var snapshot;
    var snapshotIndex = 0 ;
    if (this.props.contract.status === "inactive") {
      snapshotIndex = this.props.contract.snapshots.length-1;
      snapshot = this.props.contract.snapshots[snapshotIndex];
    } else {
      snapshotIndex = this.props.contract.snapshots.find((item) => {
        return item.active === true;
      });
      snapshot = this.props.contract.snapshots[snapshotIndex];
    }

    this.state = {
      snapshot,
      snapshotIndex,
      errorMsg: '',
      errorKeys: [],
      clientSetupOpen: (snapshotIndex === 0 && !snapshot.client),
      documentsOpen: false,
      billingOpen: false,
      databaseStatus: ''
    }
  }

  updateSnapshot = (changes, callback) => {
    var snapshot = {
      ...this.state.snapshot,
      ...changes,
    };
    this.setState({ snapshot, errorKeys: [], errorMsg: '' }, () => {
      if (typeof (callback) === "function") callback();
    })
  }

  changeSnapshot = (e, callback) => {
    var snapshotIndex = e.target.value;
    var snapshot = this.props.contract.snapshots[snapshotIndex];
    this.setState({ snapshot, snapshotIndex }, () => {
      if (typeof callback === "function") {
        callback();
      }
    });
  }

  cancelContract = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const cancel = () => {
        Meteor.call('contracts.cancel', this.props.contract._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Cancelado!"
            }
            this.setState({ databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
          if (typeof callback === "function") {
            callback();
          }
        });
      }
      this.saveEdits(cancel);
    })
  }

  saveEdits = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      if (this.props.contract.status !== 'inactive') {
        return callback(this.state.snapshot);
      }
      Meteor.call(
        'contracts.update',
        this.state.snapshot,
        this.props.contract._id,
        this.state.snapshotIndex,
        (err, res) => {
        if (res) {
          var snapshot = this.state.snapshot;
          var snapshotIndex = this.state.snapshotIndex;
          var databaseStatus;
          if (res.hasChanged) {
            snapshotIndex = res.index;
            snapshot = res.snapshot;
            databaseStatus = "completed";
          } else {
            databaseStatus = {
              status: "completed",
              message: "Nenhuma alteração realizada."
            }
          }
          if (typeof callback === "function") {
            callback(snapshot);
          } else {
            this.setState({
              snapshot,
              snapshotIndex,
              databaseStatus
            });
          }
        } else if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      });
    })
  }

  activateContract = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const activate = () => {
        var _id = this.props.contract._id;
        var snapshotIndex = this.state.snapshotIndex;
        Meteor.call('contracts.activate', _id, snapshotIndex, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Ativado!"
            }
            this.setState({ databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
          callback();
        });
      }
      this.saveEdits(activate);
    })
  }

  toggleDocuments = () => {
    this.setState({ documentsOpen: !this.state.documentsOpen })
  }

  toggleBilling = () => {
    this.setState({ billingOpen: !this.state.billingOpen })
  }

  generateDocument = () => {
    const generate = (master) => {
      master.type = "contract";
      master._id = this.props.contract._id;
      master.proposalId = this.props.contract.proposalId;
      master.proposalIndex = this.props.contract.proposalIndex;

      Meteor.call('pdf.generate', master, (err, res) => {
        if (res) {
          saveAs(res.data, res.fileName);
          this.setState({ databaseStatus: "completed" });
        }
        if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      })
    }
    this.saveEdits(generate);
  }

  setError = (errorMsg, errorKeys) => {
    this.setState({ errorMsg, errorKeys })
  }

  //
  // toggleCancelWindow = () => {
  //   var toggleCancelWindow = !this.state.toggleCancelWindow;
  //   this.setState({ toggleCancelWindow });
  // }
  //
  // toggleFinalizeWindow = () => {
  //   var toggleFinalizeWindow = !this.state.toggleFinalizeWindow;
  //   this.setState({ toggleFinalizeWindow });
  // }
  //
  // changeVersion = (e) => {
  //   this.setState({
  //     snapshot: tools.explodeSnapshot({
  //       ...this.props.snapshot,
  //       _id: this.state.snapshot._id
  //     }, e.target.value)
  //   });
  // }
  //
  // cancelSnapshot = (callback) => {
  //   this.setState({ databaseStatus: "loading" }, () => {
  //     const cancel = (snapshot) => {
  //       Meteor.call('snapshots.cancel', snapshot._id, (err, res) => {
  //         if (res) {
  //           var databaseStatus = {
  //             status: "completed",
  //             message: "Proposta Cancelada!"
  //           }
  //           snapshot.status = "cancelled";
  //           this.setState({ snapshot, databaseStatus });
  //         } else if (err) {
  //           this.setState({ databaseStatus: "failed" });
  //           console.log(err);
  //         }
  //         callback();
  //       });
  //     }
  //     this.saveEdits(cancel);
  //   })
  // }
  //

  //
  // finalizeSnapshot = (callback) => {
  //   this.setState({ databaseStatus: "loading" }, () => {
  //     const finalize = (snapshot) => {
  //       Meteor.call('snapshots.finalize', snapshot._id, (err, res) => {
  //         if (res) {
  //           var databaseStatus = {
  //             status: "completed",
  //             message: "Contrato Finalizado!"
  //           }
  //           snapshot.status = "finalized";
  //           this.setState({ snapshot, databaseStatus });
  //         } else if (err) {
  //           this.setState({ databaseStatus: "failed" });
  //           console.log(err);
  //         }
  //         callback();
  //       });
  //     }
  //     this.saveEdits(finalize);
  //   })
  // }
  //
  // saveEdits = (callback) => {
  //   this.setState({ databaseStatus: "loading" }, () => {
  //     // Only update. Snapshots are inserted by activating Proposals
  //     Meteor.call('snapshots.update', this.state.snapshot, (err, res) => {
  //       if (res) {
  //         var snapshot;
  //         var databaseStatus;
  //         if (res.hasChanged) {
  //           snapshot = tools.explodeSnapshot(res.snapshot);
  //           databaseStatus = "completed";
  //         } else {
  //           snapshot = this.state.snapshot;
  //           databaseStatus = {
  //             status: "completed",
  //             message: "Nenhuma alteração realizada."
  //           }
  //         }
  //         if (typeof callback === "function") {
  //           callback(snapshot);
  //         } else this.setState({ snapshot, databaseStatus });
  //       } else if (err) {
  //         this.setState({ databaseStatus: "failed" });
  //         console.log(err);
  //       }
  //     });
  //   })
  // }
  //

  totalValue = (option) => {
    var duration = this.state.snapshot.dates.timeUnit === "months" ? this.state.snapshot.dates.duration : 1;
    var discount = this.state.snapshot.discount;

    var containers = this.state.snapshot.containers || [];
    var accessories = this.state.snapshot.accessories || [];

    var products = containers.concat(accessories);
    var productsValue = products.reduce((acc, current) => {
      var renting = current.renting || 1;
      return acc + (current.price * renting * duration)
    }, 0);
    productsValue = productsValue * (1 - discount);

    var services = this.state.snapshot.services || [];
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
    return (
      <div className="page-content">
        <RedirectUser currentPage="contract"/>
        <div className="main-scene">
          <MainHeader
            createdByName={this.state.snapshot.createdByName}
            title={"Contrato #" + this.props.contract._id}
            status={this.props.contract.status}
            type="contract"
            toggleDocuments={this.toggleDocuments}

            toggleBilling={this.toggleBilling}
            errorKeys={this.state.errorKeys}

            cancelMaster={this.cancelContract}
            changeSnapshot={this.changeSnapshot}
            snapshotIndex={this.state.snapshotIndex}
            snapshots={this.props.contract.snapshots}
          />
          <div className="main-scene__body">
            <Information
              disabled={this.props.contract.status !== "inactive"}
              clientsDatabase={this.props.databases.clientsDatabase}
              contract={this.props.contract}
              snapshot={this.state.snapshot}
              updateSnapshot={this.updateSnapshot}
              errorKeys={this.state.errorKeys}
              settings={this.props.settings}
            />
            <MainItems
              disabled={this.props.contract.status !== "inactive"}
              snapshot={this.state.snapshot}
              databases={this.props.databases}
              updateSnapshot={this.updateSnapshot}
              docType="contract"
            />
            <Footer
              totalValue={this.totalValue()}
              productsValue={this.totalValue('products')}
              servicesValue={this.totalValue('services')}
              snapshot={this.state.snapshot}
              setError={this.setError}
              creationDate={this.props.contract.snapshots[0].dates.creationDate}
              status={this.props.contract.status}
              saveEdits={this.saveEdits}
              activateContract={this.activateContract}
            />
          </div>
          <DatabaseStatus status={this.state.databaseStatus}/>
          {this.state.clientSetupOpen ?
            <ClientSetup
              updateSnapshot={this.updateSnapshot}
              proposalClient={this.props.proposalClient}
              closeWindow={() => this.setState({ clientSetupOpen: false})}
              clientsDatabase={this.props.databases.clientsDatabase}/>
          : null}
          {this.state.documentsOpen ?
            <Documents
              snapshot={this.state.snapshot}
              updateSnapshot={this.updateSnapshot}
              disabled={this.props.contract.status !== "inactive"}
              toggleWindow={this.toggleDocuments}
              settings={this.props.settings}
              generateDocument={this.generateDocument}
            />
          : null}
          {this.state.billingOpen ?
          <BillingSchedule
            disabled={this.props.contract.status !== "inactive"}
            snapshot={this.state.snapshot}
            totalValue={this.totalValue}
            closeWindow={this.toggleBilling}
            updateSnapshot={this.updateSnapshot}
            errorKeys={this.props.errorKeys}
            /> : null}
        </div>
      </div>
    )
  }
}

function SnapshotLoader (props) {
  if (props.match.params.snapshotId === 'new' || props.contract) {
    return <Contract {...props} />
  } else return null;
}

export default ContractWrapper = withTracker((props) => {
  Meteor.subscribe('contractsPub');
  Meteor.subscribe('clientsPub');
  Meteor.subscribe('containersPub');
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('servicesPub');
  Meteor.subscribe('proposalsPub');
  Meteor.subscribe('accountsPub');


  // Meteor.subscribe('placesPub');
  // Meteor.subscribe('usersPub');

  var databases = {
    // contractsDatabase: Contracts.find().fetch(),
    clientsDatabase: Clients.find().fetch(),
    accountsDatabase: Accounts.find().fetch(),
    //
    // placesDatabase: Places.find().fetch(),
    //
    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch(),
    //
    // usersDatabase: Meteor.users.find().fetch()

  }
  var contract = undefined;
  if (props.match.params.contractId !== 'new') {
    contract = Contracts.findOne({ _id: props.match.params.contractId });
  }

  var proposalClient = {};

  if (contract && contract.snapshots.length === 1) {
    var proposal = Proposals.findOne({ _id: contract.proposalId });
    if (proposal) {
      var index = contract.proposalIndex;
      var proposalIndex = proposal.snapshots[index];
      proposalClient = proposalIndex.client;
    }
  }

  return {
    databases,
    contract,
    proposalClient
  }
})(SnapshotLoader);