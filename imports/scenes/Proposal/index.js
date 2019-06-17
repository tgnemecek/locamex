import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Proposals } from '/imports/api/proposals/index';
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

import SceneHeader from '/imports/components/SceneHeader/index';
import SceneItems from '/imports/components/SceneItems/index';
import SceneFooter from '/imports/components/SceneFooter/index';

import Information from './Information/index';

class Proposal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proposal: this.props.proposal || {
        _id: undefined,
        createdBy: Meteor.user() || {username: "Anônimo"},
        status: "inactive",

        client: {
          description: '',
          name: '',
          email: '',
          phone: ''
        },

        version: 0,

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
      ready: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.databases !== this.props.databases) {
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
      ...changes,
      errorKeys: [],
      errorMsg: ''
    };
    this.setState({ proposal }, () => {
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

  cancelProposal = (callback) => {
    Meteor.call('proposals.update.one', this.state.proposal._id, {status: "cancelled"}, (err, res) => {
      if (res) {
        var proposal = {
          ...this.state.proposal,
          status: "cancelled",
          _id: res
        }
        this.setState({ proposal });
      } else if (err) alert(err.reason);
    });
    callback();
  }

  activateProposal = (callback) => {
    Meteor.call('proposals.activate', this.state.proposal, (err, res) => {
      if (res) {
        var proposal = {
          ...this.state.proposal,
          status: "active",
          _id: res
        }
        this.setState({ proposal });
      } else if (err) alert(err.reason);
    });
    callback();
  }

  finalizeProposal = (callback) => {
    Meteor.call('proposals.finalize', this.state.proposal, (err, res) => {
      if (res) {
        var proposal = {
          ...this.state.proposal,
          status: "finalized",
          _id: res
        }
        this.props.history.push("/proposal/" + res);
        this.setState({ proposal });
      } else if (err) alert(err.reason);
    });
    callback();
  }

  saveEdits = () => {
    if (this.props.match.params.proposalId == 'new') {
      Meteor.call('proposals.insert', this.state.proposal, (err, res) => {
        if (res) {
          var proposal = {
            ...this.state.proposal,
            _id: res
          }
          this.props.history.push("/proposal/" + res);
          this.setState({ proposal });
        }
        else if (err) alert(err.error);
      });
    } else Meteor.call('proposals.update', this.state.proposal);
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

            updateMaster={this.updateProposal}
            cancelMaster={this.cancelProposal}
            saveMaster={this.saveEdits}

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

  var databases = {
    proposalsDatabase: Proposals.find().fetch(),
    clientsDatabase: Clients.find().fetch(),

    placesDatabase: Places.find().fetch(),

    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch()

  }
  var proposal = undefined;
  if (props.match.params.proposalId !== 'new') {
    proposal = Proposals.findOne({ _id: props.match.params.proposalId });
  }
  return { databases, proposal }

})(ProposalLoader);
