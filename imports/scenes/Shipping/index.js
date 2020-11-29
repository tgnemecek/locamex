import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import tools from "/imports/startup/tools/index";
import RedirectUser from "/imports/components/RedirectUser/index";
import { Contracts } from "/imports/api/contracts/index";
import { Places } from "/imports/api/places/index";
import { Series } from "/imports/api/series/index";
import { Modules } from "/imports/api/modules/index";
import { Containers } from "/imports/api/containers/index";
import { Variations } from "/imports/api/variations/index";
import { Packs } from "/imports/api/packs/index";

import MainHeader from "/imports/components/MainHeader/index";
import FooterButtons from "/imports/components/FooterButtons/index";

import StockTransition from "./StockTransition/index";
import CurrentlyRented from "./CurrentlyRented/index";
import ShippingHistory from "./ShippingHistory/index";
import Send from "./Send/index";
import Receive from "./Receive/index";
import ModuleList from "./ModuleList/index";

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleSend: false,
      toggleReceive: false,
    };
  }

  toggleSend = () => {
    this.setState({
      toggleSend: !this.state.toggleSend,
    });
  };

  toggleReceive = () => {
    this.setState({ toggleReceive: !this.state.toggleReceive });
  };

  render() {
    return (
      <div className="page-content">
        <RedirectUser currentPage="shipping" />
        <div className="main-scene shipping">
          <MainHeader
            createdByName={this.props.snapshot.createdByName}
            title={"Contrato #" + this.props.contract._id}
            status={this.props.contract.status}
            type="contract"
            toggleDocuments={this.toggleDocuments}
          />
          <div className="main-scene__body">
            <CurrentlyRented
              currentlyRented={tools.getCurrentlyRentedItems(
                this.props.contract
              )}
            />
            <ShippingHistory
              contractId={this.props.contract._id}
              shipping={this.props.contract.shipping}
            />
            {this.state.toggleSend ? (
              <Send
                toggleSend={this.toggleSend}
                databases={this.props.databases}
                contract={this.props.contract}
                snapshot={this.props.snapshot}
                StockTransition={StockTransition}
                ModuleList={ModuleList}
                currentlyRented={tools.getCurrentlyRentedItems(
                  this.props.contract
                )}
              />
            ) : null}
            {this.state.toggleReceive ? (
              <Receive
                toggleReceive={this.toggleReceive}
                databases={this.props.databases}
                contract={this.props.contract}
                ModuleList={ModuleList}
                StockTransition={StockTransition}
                currentlyRented={tools.getCurrentlyRentedItems(
                  this.props.contract
                )}
              />
            ) : null}
            <FooterButtons
              disabled={this.props.contract.status === "cancelled"}
              buttons={
                this.props.contract.status === "finalized"
                  ? [
                      {
                        text: "Nova Devolução",
                        className: "button--secondary",
                        onClick: this.toggleReceive,
                      },
                    ]
                  : [
                      {
                        text: "Novo Envio",
                        className: "button--secondary",
                        onClick: this.toggleSend,
                      },
                      {
                        text: "Nova Devolução",
                        className: "button--secondary",
                        onClick: this.toggleReceive,
                      },
                    ]
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

function ShippingLoader(props) {
  if (props.contract) {
    return <Shipping {...props} />;
  } else return null;
}

export default ShippingWrapper = withTracker((props) => {
  Meteor.subscribe("contractsPub");
  Meteor.subscribe("placesPub");
  Meteor.subscribe("seriesPub");
  Meteor.subscribe("modulesPub");
  Meteor.subscribe("containersPub");
  Meteor.subscribe("variationsPub");
  Meteor.subscribe("packsPub");

  var contract = Contracts.findOne({
    _id: props.match.params.contractId,
  });

  var databases = {
    placesDatabase: Places.find().fetch(),
    seriesDatabase: Series.find().fetch(),
    modulesDatabase: Modules.find().fetch(),
    containersDatabase: Containers.find().fetch(),
    variationsDatabase: Variations.find().fetch(),
    packsDatabase: Packs.find({
      $and: [{ rented: false }, { visible: true }],
    }).fetch(),
  };

  var snapshot;

  if (contract) {
    snapshot = contract.snapshots.find((item) => {
      return item.active;
    });
    if (!snapshot) {
      snapshot = contract.snapshots[contract.snapshots.length - 1];
    }
  }

  return { contract, snapshot, databases };
})(ShippingLoader);
