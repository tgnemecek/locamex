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
import SceneItems from '/imports/components/SceneItems/index';
import SceneFooter from '/imports/components/SceneFooter/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import ClientSetup from './ClientSetup/index';
import BillingSchedule from './BillingSchedule/index';
import Information from './Information/index';

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
      clientSetupWindow: true,
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
    this.setState({
      snapshot: tools.explodeSnapshot({
        ...this.props.snapshot,
        _id: this.state.snapshot._id
      }, e.target.value)
    });
  }

  cancelSnapshot = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const cancel = (snapshot) => {
        Meteor.call('snapshots.cancel', snapshot._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Proposta Cancelada!"
            }
            snapshot.status = "cancelled";
            this.setState({ snapshot, databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
          callback();
        });
      }
      this.saveEdits(cancel);
    })
  }

  activateSnapshot = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const activate = (snapshot) => {
        Meteor.call('snapshots.activate', snapshot, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Ativado!"
            }
            snapshot.status = "active";
            snapshot.activeVersion = snapshot.version;
            this.setState({ snapshot, databaseStatus });
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

  finalizeSnapshot = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const finalize = (snapshot) => {
        Meteor.call('snapshots.finalize', snapshot._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Finalizado!"
            }
            snapshot.status = "finalized";
            this.setState({ snapshot, databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
          callback();
        });
      }
      this.saveEdits(finalize);
    })
  }

  saveEdits = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      // Only update. Snapshots are inserted by activating Proposals
      Meteor.call('snapshots.update', this.state.snapshot, (err, res) => {
        if (res) {
          var snapshot;
          var databaseStatus;
          if (res.hasChanged) {
            snapshot = tools.explodeSnapshot(res.snapshot);
            databaseStatus = "completed";
          } else {
            snapshot = this.state.snapshot;
            databaseStatus = {
              status: "completed",
              message: "Nenhuma alteração realizada."
            }
          }
          if (typeof callback === "function") {
            callback(snapshot);
          } else this.setState({ snapshot, databaseStatus });
        } else if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      });
    })
  }

  generateDocument = () => {
    const generate = (master) => {
      master.type = "snapshot";

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
    var disabled = this.state.snapshot.status === "cancelled";
    return (
      <div className="page-content">
        {/* <RedirectUser currentPage="snapshot"/> */}
        <div className="base-scene snapshot">
          <MainHeader
            master={{...this.state.snapshot, type: "snapshot"}}
            databases={this.props.databases}
            snapshots={this.props.snapshot ? this.props.snapshot.snapshots : []}
            changeVersion={this.changeVersion}

            BillingSchedule={BillingSchedule}

            updateMaster={this.updateSnapshot}
            cancelMaster={this.cancelSnapshot}
            saveMaster={this.saveEdits}
            generateDocument={this.generateDocument}

            errorKeys={this.state.errorKeys}
            disabled={disabled}
          />
          {/* <div className="snapshot__body">
            <Information
              disabled={this.state.snapshot.status !== "inactive"}
              clientsDatabase={this.props.databases.clientsDatabase}
              snapshot={this.state.snapshot}
              updateSnapshot={this.updateSnapshot}
              errorKeys={this.state.errorKeys}
            />
            <SceneItems
              disabled={this.state.snapshot.status !== "inactive"}
              master={this.state.snapshot}
              databases={this.props.databases}
              updateMaster={this.updateSnapshot}
            />
            <DatabaseStatus status={this.state.databaseStatus}/>
            {this.state.clientSetupWindow ?
              <ClientSetup
                updateSnapshot={this.updateSnapshot}
                proposal={this.props.proposal}
                closeWindow={() => this.setState({ clientSetupWindow: false })}
                clientsDatabase={this.props.databases.clientsDatabase}/>
            : null}
          </div>
          <SceneFooter
            totalValue={this.totalValue()}
            productsValue={this.totalValue('products')}
            servicesValue={this.totalValue('services')}

            setError={this.setError}
            errorMsg={this.state.errorMsg}

            master={{...this.state.snapshot, type: "snapshot"}}

            saveEdits={this.saveEdits}
            activateMaster={this.activateSnapshot}
            finalizeMaster={this.finalizeSnapshot}
          />*/}
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

export default SnapshotWrapper = withTracker((props) => {
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

  if (contract) {
    var proposalId = contract.proposalNumber.replace(/\.\d+/g, '');
    var proposal = Proposals.findOne({ _id: proposalId });
    if (proposal) {
      var proposalSnapshot = proposal.snapshots.find((item) => {
        return item.active === true;
      })
      proposalClient = proposalSnapshot.client;
    }
  }

  return {
    databases,
    contract,
    proposalClient
  }
})(SnapshotLoader);