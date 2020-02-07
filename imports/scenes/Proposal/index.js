import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { saveAs } from 'file-saver';
import ErrorBoundary from '/imports/components/ErrorBoundary/index';

import { Proposals } from '/imports/api/proposals/index';
import { Containers } from '/imports/api/containers/index';
import { Accessories } from '/imports/api/accessories/index';
import { Services } from '/imports/api/services/index';
import { Settings } from '/imports/api/settings/index';

import RedirectUser from '/imports/components/RedirectUser/index';
import tools from '/imports/startup/tools/index';

import Box from '/imports/components/Box/index';
import Checkmark from '/imports/components/Checkmark/index';
import AppHeader from '/imports/components/AppHeader/index';
import Input from '/imports/components/Input/index';

import MainHeader from '/imports/components/MainHeader/index';
import MainItems from '/imports/components/MainItems/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import Documents from './Documents/index';
import Information from './Information/index';
import Footer from './Footer/index';

class Proposal extends React.Component {
  constructor(props) {
    super(props);
    var snapshot;
    var snapshotIndex = 0;
    if (this.props.proposal) {
      if (this.props.proposal.status === "inactive") {
        snapshotIndex = this.props.proposal.snapshots.length-1;
        snapshot = this.props.proposal.snapshots[snapshotIndex];
      } else {
        snapshotIndex = this.props.proposal.snapshots.findIndex((item) => {
          return item.active === true;
        });
        snapshot = this.props.proposal.snapshots[snapshotIndex];
      }
    };
    this.state = {
      snapshot: snapshot || {
        active: false,
        createdById: '',
        createdByName: '',
        client: {
          description: '',
          name: '',
          email: '',
          phone: ''
        },
        discount: 0,
        observations: {
          internal: '',
          external: '',
          conditions: this.props.settings.defaultConditionsMonths
        },
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
          duration: 1,
          timeUnit: "months"
        },
        containers: [],
        accessories: [],
        services: []
      },
      snapshotIndex,
      documentsOpen: false,
      errorMsg: '',
      errorKeys: [],
      databaseStatus: ''
    }
  }

  componentDidUpdate(prevProps) {
    var user = Meteor.user();
    if (prevProps.user !== user && user.firstName) {
      if (!this.state.createdById) {
        this.setState({
          createdById: user._id,
          createdByName: user.firstName + " " + user.lastName
        })
      }
    }
  }

  updateSnapshot = (changes, callback) => {
    var snapshot = {
      ...this.state.snapshot,
      ...changes
    };
    this.setState({ snapshot, errorKeys: [], errorMsg: '' }, () => {
      if (typeof (callback) === "function") callback(changes);
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

  changeSnapshot = (e, callback) => {
    var snapshotIndex = e.target.value;
    var snapshot = this.props.proposal.snapshots[snapshotIndex];
    this.setState({ snapshot, snapshotIndex }, () => {
      if (typeof callback === "function") {
        callback();
      }
    });
  }

  cancelProposal = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const cancel = () => {
        Meteor.call('proposals.cancel', this.props.proposal._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Proposta Cancelada!"
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

  activateProposal = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const activate = () => {
        var _id = this.props.proposal._id;
        var snapshotIndex = this.state.snapshotIndex;
        Meteor.call('proposals.activate', _id, snapshotIndex, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Proposta Fechada! Gerado Contrato #" + res
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

  saveEdits = (callback) => {
    console.log(this.state.snapshot);
    this.setState({ databaseStatus: "loading" }, () => {
      if (this.props.proposal && this.props.proposal.status !== 'inactive') {
        return callback(this.state.snapshot);
      }
      if (this.props.match.params.proposalId == 'new') {
        Meteor.call('proposals.insert', this.state.snapshot, (err, res) => {
          if (res) {
            var proposal = res;
            var index = proposal.snapshots.length-1;
            var snapshot = proposal.snapshots[index];
            this.props.history.push("/proposal/" + proposal._id);
            if (typeof callback === "function") {
              callback(snapshot);
            } else this.setState({ snapshot, databaseStatus: "completed" });
          }
          else if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
        });
      } else {
        Meteor.call(
          'proposals.update',
          this.state.snapshot,
          this.props.proposal._id,
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
      }
    })
  }

  toggleDocuments = () => {
    this.setState({ documentsOpen: !this.state.documentsOpen })
  }

  generateDocument = (includeFlyer) => {
    const generate = (master) => {
      master._id = this.props.proposal._id;
      master.type = "proposal";
      master.includeFlyer = includeFlyer;
      master.version = this.state.snapshotIndex;

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
    return (
      <div className="page-content">
        <RedirectUser currentPage="proposal"/>
        <div className="base-scene proposal">
          <MainHeader
            createdByName={this.state.createdByName}
            title={this.props.proposal ?
              "Proposta #" + this.props.proposal._id + "."
              : "Nova Proposta"}
            status={this.props.proposal ?
              this.props.proposal.status
              : 'inactive'}
            type="proposal"
            toggleDocuments={this.toggleDocuments}
            toggleCancel={this.cancelProposal}

            changeSnapshot={this.changeSnapshot}
            snapshotIndex={this.state.snapshotIndex}
            snapshots={this.props.proposal ?
              this.props.proposal.snapshots : []}
          />
          <div className="proposal__body">
            <Information
              disabled={this.props.proposal ? this.props.proposal.status !== "inactive" : false}
              clientsDatabase={this.props.databases.clientsDatabase}
              snapshot={this.state.snapshot}
              updateSnapshot={this.updateSnapshot}
              errorKeys={this.state.errorKeys}
              settings={this.props.settings}
            />
            <MainItems
              disabled={this.props.proposal ? this.props.proposal.status !== "inactive" : false}
              snapshot={this.state.snapshot}
              databases={this.props.databases}
              updateSnapshot={this.updateSnapshot}
              docType="proposal"
            />
            <Footer
              totalValue={this.totalValue()}
              creationDate={this.props.proposal ?
              this.props.proposal.snapshots[0].dates.creationDate
              : this.state.snapshot.dates.creationDate}
              status={this.props.proposal ? this.props.proposal.status : 'inactive'}
              saveEdits={this.saveEdits}
              activateProposal={this.activateProposal}
            />
          </div>
          <DatabaseStatus status={this.state.databaseStatus}/>
          {this.state.documentsOpen ?
            <Documents
              snapshot={this.state.snapshot}
              updateSnapshot={this.updateSnapshot}
              disabled={this.props.proposal ? this.props.proposal.status !== "inactive" : false}
              toggleWindow={this.toggleDocuments}
              settings={this.props.settings}
              generateDocument={this.generateDocument}
            />
          : null}
        </div>
      </div>
    )
  }
}

function ProposalLoader (props) {
  if (props.match.params.proposalId === 'new' || props.proposal) {
    if (Object.entries(props.settings).length) {
      return <ErrorBoundary><Proposal {...props} /></ErrorBoundary>
    }
  }
  return null;
}

export default ProposalWrapper = withTracker((props) => {
  Meteor.subscribe('proposalsPub');
  Meteor.subscribe('containersPub');
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('servicesPub');
  Meteor.subscribe('settingsPub');

  var databases = {
    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch()
  }
  var proposal = undefined;
  if (props.match.params.proposalId !== 'new') {
    proposal = Proposals.findOne({
      _id: props.match.params.proposalId
    });
  }
  var user = Meteor.user();
  var settings = Settings.findOne({});
  return {
    databases,
    proposal,
    user,
    settings: settings ? settings.proposal : {}
  }

})(ProposalLoader);
