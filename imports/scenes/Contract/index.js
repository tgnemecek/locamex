import { Meteor } from "meteor/meteor";
import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import { Accounts } from "/imports/api/accounts/index";
import { Contracts } from "/imports/api/contracts/index";
import { Proposals } from "/imports/api/proposals/index";
import { Clients } from "/imports/api/clients/index";
import { Places } from "/imports/api/places/index";
import { Containers } from "/imports/api/containers/index";
import { Accessories } from "/imports/api/accessories/index";
import { Services } from "/imports/api/services/index";
import { Users } from "/imports/api/users/index";

import RedirectUser from "/imports/components/RedirectUser/index";
import tools from "/imports/startup/tools/index";

import Box from "/imports/components/Box/index";
import Checkmark from "/imports/components/Checkmark/index";
import AppHeader from "/imports/components/AppHeader/index";
import NotFound from "/imports/components/NotFound/index";
import Loading from "/imports/components/Loading/index";

import MainHeader from "/imports/components/MainHeader/index";
import MainItems from "/imports/components/MainItems/index";
import DatabaseStatus from "/imports/components/DatabaseStatus/index";

import ClientSetup from "./ClientSetup/index";
import BillingSchedule from "./BillingSchedule/index";
import Documents from "./Documents/index";
import Information from "./Information/index";
import Footer from "./Footer/index";

class Contract extends React.Component {
  constructor(props) {
    super(props);
    var snapshot;
    var snapshotIndex = 0;
    if (this.props.contract.status === "inactive") {
      snapshotIndex = this.props.contract.snapshots.length - 1;
      snapshot = this.props.contract.snapshots[snapshotIndex];
    } else {
      snapshotIndex = this.props.contract.snapshots.findIndex((item) => {
        return item.active === true;
      });
      if (snapshotIndex === -1) {
        snapshotIndex = this.props.contract.snapshots.length - 1;
      }
      snapshot = this.props.contract.snapshots[snapshotIndex];
    }

    this.state = {
      snapshot,
      snapshotIndex,
      errorMsg: "",
      errorKeys: [],
      clientSetupOpen: snapshotIndex === 0 && !snapshot.client._id,
      documentsOpen: false,
      billingOpen: false,
      databaseStatus: "",
    };
  }

  updateSnapshot = (changes, callback) => {
    var snapshot = {
      ...this.state.snapshot,
      ...changes,
    };
    this.setState(
      {
        snapshot,
        errorKeys: [],
        errorMsg: "",
      },
      () => {
        if (typeof callback === "function") callback();
      }
    );
  };

  changeSnapshot = (e, callback) => {
    var snapshotIndex = e.target.value;
    var snapshot = this.props.contract.snapshots[snapshotIndex];
    this.setState({ snapshot, snapshotIndex }, () => {
      if (typeof callback === "function") {
        callback();
      }
    });
  };

  activateContract = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const activate = () => {
        var _id = this.props.contract._id;
        var snapshotIndex = this.state.snapshotIndex;
        Meteor.call("contracts.activate", _id, snapshotIndex, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Ativado!",
            };
            this.setState({ databaseStatus });
          } else if (err) {
            this.setState({
              databaseStatus: {
                status: "failed",
                message: tools.translateError(err),
              },
            });
            console.log(err);
          }
          callback();
        });
      };
      this.saveEdits(activate);
    });
  };

  cancelContract = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      const cancel = () => {
        Meteor.call("contracts.cancel", this.props.contract._id, (err, res) => {
          if (res) {
            var databaseStatus = {
              status: "completed",
              message: "Contrato Cancelado!",
            };
            this.setState({ databaseStatus });
          } else if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
          if (typeof callback === "function") {
            callback();
          }
        });
      };
      this.saveEdits(cancel);
    });
  };

  saveEdits = (callback) => {
    this.setState({ databaseStatus: "loading" }, () => {
      if (this.props.contract.status !== "inactive") {
        return callback(this.state.snapshot);
      }
      Meteor.call(
        "contracts.update",
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
                message: "Nenhuma alteração realizada.",
              };
            }
            this.setState(
              {
                snapshot,
                snapshotIndex,
                databaseStatus,
              },
              () => {
                if (typeof callback === "function") {
                  callback(snapshot, snapshotIndex);
                }
              }
            );
          } else if (err) {
            this.setState({ databaseStatus: "failed" });
            console.log(err);
          }
        }
      );
    });
  };

  toggleDocuments = () => {
    this.setState({ documentsOpen: !this.state.documentsOpen });
  };

  toggleBilling = () => {
    this.setState({ billingOpen: !this.state.billingOpen });
  };

  generateDocument = () => {
    const generate = (snapshot) => {
      let props = {
        ...snapshot,
        _id: this.props.contract._id,
        proposalId: this.props.contract.proposalId,
        proposalIndex: this.props.contract.proposalIndex,
        type: "contract",
        includeFlyer: false,
        version: Number(this.state.snapshotIndex) + 1,
      };

      Meteor.call("pdf.generate", props, (err, res) => {
        if (res) {
          saveAs(res.data, res.fileName);
          this.setState({ databaseStatus: "completed" });
        }
        if (err) {
          this.setState({ databaseStatus: "failed" });
          console.log(err);
        }
      });
    };
    if (this.props.contract.status === "inactive") {
      this.saveEdits(generate);
    } else {
      this.setState({ databaseStatus: "loading" }, () => {
        generate(this.state.snapshot);
      });
    }
  };

  verifyFields = () => {
    var errorKeys = [];
    var errorMsg = "";

    const isBillingCorrect = () => {
      if (!this.state.snapshot.billingProducts.length) return false;
      if (!this.state.snapshot.billingServices.length) return false;

      var productsGoalValue = this.totalValue("products");
      var productsValue = this.state.snapshot.billingProducts.reduce(
        (acc, cur) => {
          return acc + cur.value;
        },
        0
      );
      productsValue = tools.round(productsValue, 2);
      if (productsGoalValue !== productsValue) return false;

      var servicesGoalValue = this.totalValue("services");
      var servicesValue = this.state.snapshot.billingServices.reduce(
        (acc, cur) => {
          return acc + cur.value;
        },
        0
      );
      servicesValue = tools.round(servicesValue, 2);
      if (servicesGoalValue !== servicesValue) return false;
      return true;
    };

    const setErrorKeys = () => {
      if (!this.state.snapshot.client._id) {
        errorKeys.push("client");
      }
      if (!this.state.snapshot.dates.duration) {
        errorKeys.push("duration");
      }
      if (!this.state.snapshot.negociatorId) {
        errorKeys.push("negociatorId");
      }
      if (!this.state.snapshot.representativesId[0]) {
        errorKeys.push("rep0");
      }
      if (!this.state.snapshot.deliveryAddress.cep) {
        errorKeys.push("cep");
      }
      if (!this.state.snapshot.deliveryAddress.street) {
        errorKeys.push("street");
      }
      if (!this.state.snapshot.deliveryAddress.city) {
        errorKeys.push("city");
      }
      if (!this.state.snapshot.deliveryAddress.state) {
        errorKeys.push("state");
      }
      if (!this.state.snapshot.deliveryAddress.number) {
        errorKeys.push("number");
      }
      if (!isBillingCorrect()) {
        errorKeys.push("billing");
      }
    };

    setErrorKeys();

    if (errorKeys.length > 0) {
      errorMsg = "Campos obrigatórios não preenchidos.";
      this.setState({ errorMsg, errorKeys });
      return false;
    } else {
      this.setState({ errorMsg: "", errorKeys });
      return true;
    }
  };

  totalValue = (option) => {
    var duration =
      this.state.snapshot.dates.timeUnit === "months"
        ? this.state.snapshot.dates.duration
        : 1;
    var discount = this.state.snapshot.discount;

    var containers = this.state.snapshot.containers || [];
    var accessories = this.state.snapshot.accessories || [];

    var products = containers.concat(accessories);
    var productsValue = products.reduce((acc, current) => {
      var quantity = current.quantity || 1;
      return acc + current.price * quantity * duration;
    }, 0);
    productsValue = productsValue * (1 - discount);

    var services = this.state.snapshot.services || [];
    var servicesValue = services.reduce((acc, current) => {
      var quantity = current.quantity ? current.quantity : 1;
      return acc + current.price * quantity;
    }, 0);

    if (option === "products") {
      return productsValue;
    } else if (option === "services") {
      return servicesValue;
    } else return productsValue + servicesValue;
  };

  render() {
    return (
      <div className="page-content">
        <RedirectUser currentPage="contract" />
        <div className="main-scene">
          <MainHeader
            createdByName={this.state.snapshot.createdByName}
            title={"Contrato #" + this.props.contract._id}
            status={this.props.contract.status}
            type="contract"
            toggleDocuments={this.toggleDocuments}
            documentsError={
              this.state.errorKeys.includes("negociatorId") ||
              this.state.errorKeys.includes("rep0")
            }
            toggleBilling={this.toggleBilling}
            billingError={this.state.errorKeys.includes("billing")}
            cancelMaster={
              this.props.contract.status !== "finalized"
                ? this.cancelContract
                : null
            }
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
            <div className="error-message">{this.state.errorMsg}</div>
            <Footer
              totalValue={this.totalValue()}
              productsValue={this.totalValue("products")}
              servicesValue={this.totalValue("services")}
              snapshot={this.state.snapshot}
              verifyFields={this.verifyFields}
              status={this.props.contract.status}
              saveEdits={this.saveEdits}
              activateContract={this.activateContract}
            />
          </div>
          <DatabaseStatus status={this.state.databaseStatus} />
          {this.state.clientSetupOpen ? (
            <ClientSetup
              updateSnapshot={this.updateSnapshot}
              proposalClient={this.props.proposalClient}
              closeWindow={() => this.setState({ clientSetupOpen: false })}
              clientsDatabase={this.props.databases.clientsDatabase}
            />
          ) : null}
          {this.state.documentsOpen ? (
            <Documents
              disabled={this.props.contract.status !== "inactive"}
              verifyFields={this.verifyFields}
              errorKeys={this.state.errorKeys}
              updateSnapshot={this.updateSnapshot}
              client={this.state.snapshot.client}
              representativesId={this.state.snapshot.representativesId}
              negociatorId={this.state.snapshot.negociatorId}
              generateDocument={this.generateDocument}
              toggleWindow={this.toggleDocuments}
            />
          ) : null}
          {this.state.billingOpen ? (
            <BillingSchedule
              disabled={this.props.contract.status !== "inactive"}
              snapshot={this.state.snapshot}
              totalValue={this.totalValue}
              closeWindow={this.toggleBilling}
              updateSnapshot={this.updateSnapshot}
              errorKeys={this.props.errorKeys}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

function SnapshotLoader(props) {
  if (props.match.params.snapshotId === "new" || props.contract) {
    return <Contract {...props} />;
  } else return null;
}

export default ContractWrapper = withTracker((props) => {
  Meteor.subscribe("contractsPub");
  Meteor.subscribe("clientsPub");
  Meteor.subscribe("containersPub");
  Meteor.subscribe("accessoriesPub");
  Meteor.subscribe("servicesPub");
  Meteor.subscribe("proposalsPub");
  Meteor.subscribe("accountsPub");

  var databases = {
    clientsDatabase: Clients.find().fetch(),
    accountsDatabase: Accounts.find().fetch(),
    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    servicesDatabase: Services.find().fetch(),
  };
  var contract = undefined;
  if (props.match.params.contractId !== "new") {
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
    proposalClient,
  };
})(SnapshotLoader);
