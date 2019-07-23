import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Proposals } from '/imports/api/proposals/index';
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

import SceneHeader from '/imports/components/SceneHeader/index';
import SceneItems from '/imports/components/SceneItems/index';
import SceneFooter from '/imports/components/SceneFooter/index';
import DatabaseStatus from '/imports/components/DatabaseStatus/index';

import Information from './Information/index';

class Proposal extends React.Component {
  constructor(props) {
    super(props);
    const getDocument = () => {
      if (this.props.proposal) {
        return {
          ...this.props.proposal.snapshots[this.props.proposal.activeVersion],
          _id: this.props.proposal._id,
          status: this.props.proposal.status,
          activeVersion: this.props.proposal.activeVersion,
          version: this.props.proposal.activeVersion
        }
      } else return null;
    }
    this.state = {
      proposal: getDocument() || {
        _id: undefined,
        createdBy: Meteor.user()._id,
        status: "inactive",

        client: {
          description: '',
          name: '',
          email: '',
          phone: ''
        },

        version: 0,
        activeVersion: 0,

        discount: 0,

        observations: {
          internal: '',
          external: ''
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
      databaseStatus: {}
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.databases !== this.props.databases
      || prevState.proposal.version !== this.state.proposal.version) {
      this.setUpdatedItemInformation();
    }
  }

  setUpdatedItemInformation = () => {
    var proposal = { ...this.state.proposal };
    var arrayOfArrays = [proposal.containers, proposal.accessories, proposal.services];
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
    this.setState({ proposal });
  }

  updateProposal = (changes, callback) => {
    var proposal = {
      ...this.state.proposal,
      ...changes
    };
    this.setState({ proposal, errorKeys: [], errorMsg: '' }, () => {
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

  changeVersion = (e) => {
    var newVersion = e.target.value;
    var proposal = {
      ...this.props.proposal.snapshots[newVersion],
      _id: this.state.proposal._id,
      status: this.props.proposal.status,
      activeVersion: this.props.proposal.activeVersion,
      version: newVersion
    }
    this.setState({ proposal });
  }

  // NOT IN USE:
  // duplicateProposal = (callback) => {
  //   this.setState({ databaseStatus: "loading" }, () => {
  //     Meteor.call('proposals.duplicate', this.state.proposal, (err, res) => {
  //       if (res) {
  //         this.setState({ databaseStatus: "completed" });
  //       } else if (err) {
  //         this.setState({ databaseStatus: "failed" });
  //         console.log(err);
  //       }
  //     });
  //     if (typeof (callback) === "function") callback();
  //   })
  // }

  cancelProposal = (callback) => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      const cancel = (proposal) => {
        Meteor.call('proposals.cancel', proposal._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Proposta Cancelada!"
            }
            proposal.status = "cancelled";
            this.setState({ proposal, databaseStatus });
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

  activateProposal = (callback) => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      const activate = (proposal) => {
        Meteor.call('proposals.activate', proposal, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Proposta Fechada! Gerado Contrato #" + res.contractId
            }
            proposal.status = "active";
            proposal.activeVersion = proposal.version;
            this.setState({ proposal, databaseStatus });
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

  saveEdits = (callback) => {
    this.setState({ databaseStatus: {status: "loading"} }, () => {
      if (this.props.match.params.proposalId == 'new') {
        Meteor.call('proposals.insert', this.state.proposal, (err, res) => {
          if (res) {
            var proposal = {
              ...this.state.proposal,
              _id: res
            }
            this.props.history.push("/proposal/" + res);
            if (typeof callback === "function") {
              callback(proposal);
            } else this.setState({ proposal, databaseStatus: {status: "completed"} });
          }
          else if (err) {
            this.setState({ databaseStatus: {status: "failed"} });
            console.log(err);
          }
        });
      } else {
        Meteor.call('proposals.update', this.state.proposal, (err, res) => {
          if (res) {
            var proposal = {...this.state.proposal};
            var databaseStatus = {status: "completed"};
            if (res.hasChanged) {
              proposal.version = res.data.snapshots.length-1;
            } else databaseStatus.message = "Nenhuma alteração realizada."

            if (typeof callback === "function") {
              callback(proposal);
            } else this.setState({ proposal, databaseStatus });
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
      master.type = "proposal";
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
    var duration = this.state.proposal.dates.timeUnit === "months" ? this.state.proposal.dates.duration : 1;
    var discount = this.state.proposal.discount;

    var containers = this.state.proposal.containers || [];
    var accessories = this.state.proposal.accessories || [];

    var products = containers.concat(accessories);
    var productsValue = products.reduce((acc, current) => {
      var renting = current.renting || 1;
      return acc + (current.price * renting * duration)
    }, 0);
    productsValue = productsValue * (1 - discount);

    var services = this.state.proposal.services || [];
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
    var disabled = this.state.proposal.status !== "inactive";
    return (
      <div className="page-content">
        <RedirectUser currentPage="proposal"/>
        <div className="proposal">
          <SceneHeader
            master={{...this.state.proposal, type: "proposal"}}
            databases={this.props.databases}
            snapshots={this.props.proposal ? this.props.proposal.snapshots : []}
            changeVersion={this.changeVersion}

            updateMaster={this.updateProposal}
            cancelMaster={this.cancelProposal}
            saveMaster={this.saveEdits}
            generateDocument={this.generateDocument}

            errorKeys={this.state.errorKeys}
            disabled={disabled}
          />
          <div className={disabled ? "disable-click" : ""}>
            <Information
              clientsDatabase={this.props.databases.clientsDatabase}
              proposal={this.state.proposal}
              updateProposal={this.updateProposal}
              errorKeys={this.state.errorKeys}
            />
            <SceneItems
              master={this.state.proposal}
              databases={this.props.databases}
              updateMaster={this.updateProposal}
            />
            <SceneFooter
              totalValue={this.totalValue()}
              productsValue={this.totalValue('products')}
              servicesValue={this.totalValue('services')}

              setError={this.setError}
              errorMsg={this.state.errorMsg}

              master={{...this.state.proposal, type: "proposal"}}

              saveEdits={this.saveEdits}
              activateMaster={this.activateProposal}
              finalizeMaster={this.finalizeProposal}
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

function ProposalLoader (props) {
  if (props.match.params.proposalId === 'new' || props.proposal) {
    return <Proposal {...props} />
  } else return null;
}

export default ProposalWrapper = withTracker((props) => {
  Meteor.subscribe('proposalsPub');
  Meteor.subscribe('clientsPub');

  Meteor.subscribe('placesPub');

  Meteor.subscribe('containersPub');
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('servicesPub');

  Meteor.subscribe('usersPub');

  var databases = {
    proposalsDatabase: Proposals.find().fetch(),
    clientsDatabase: Clients.find().fetch(),

    placesDatabase: Places.find().fetch(),

    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch(),

    usersDatabase: Meteor.users.find().fetch()

  }
  var proposal = undefined;
  if (props.match.params.proposalId !== 'new') {
    proposal = Proposals.findOne({ _id: props.match.params.proposalId });
  }
  return { databases, proposal }

})(ProposalLoader);
