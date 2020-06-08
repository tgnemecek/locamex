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

  currentlyRented = () => {
    var currently = {};
    // Series --------------------------------------------
    currently.series = [];
    var seriesToIgnore = [];
    for (var i = this.props.contract.shipping.length - 1; i >= 0; i--) {
      var type = this.props.contract.shipping[i].type;
      this.props.contract.shipping[i].series.forEach((series) => {
        if (!seriesToIgnore.includes(series._id)) {
          seriesToIgnore.push(series._id);
          if (type === "send") {
            currently.series.push(series);
          }
        }
      });
    }
    // Variations ---------------------------------------
    currently.variations = [];
    this.props.contract.shipping.forEach((shipping) => {
      shipping.variations.forEach((variation) => {
        var found = currently.variations.find((item) => {
          return item._id === variation._id;
        });
        var value = variation.places.reduce((acc, item) => {
          return acc + item.quantity;
        }, 0);

        value = shipping.type === "send" ? value : -value;

        if (found) {
          found.quantity += value;
        } else {
          currently.variations.push({
            _id: variation._id,
            type: "variation",
            accessory: variation.accessory,
            description: variation.description,
            observations: variation.observations,
            quantity: value,
          });
        }
      });
    });
    currently.variations = currently.variations.filter((item) => {
      return item.quantity;
    });
    // Packs ---------------------------------------------
    currently.packs = [];
    var packsToIgnore = [];
    for (var i = this.props.contract.shipping.length - 1; i >= 0; i--) {
      var type = this.props.contract.shipping[i].type;
      this.props.contract.shipping[i].packs.forEach((pack) => {
        if (!packsToIgnore.includes(pack._id)) {
          packsToIgnore.push(pack._id);
          if (type === "send") {
            currently.packs.push(pack);
          }
        }
      });
    }

    // currently.packs = allSends.packs.filter((itemSent) => {
    //   return !allReceives.packs.find((itemReceived) => {
    //     return itemReceived._id === itemSent._id
    //   })
    // }).map((item) => {
    //   return {...item, place: {}, unmount: true}
    // })
    return currently;
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
            <CurrentlyRented currentlyRented={this.currentlyRented()} />
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
                currentlyRented={this.currentlyRented()}
              />
            ) : null}
            {this.state.toggleReceive ? (
              <Receive
                toggleReceive={this.toggleReceive}
                databases={this.props.databases}
                contract={this.props.contract}
                ModuleList={ModuleList}
                StockTransition={StockTransition}
                currentlyRented={this.currentlyRented()}
              />
            ) : null}
            <FooterButtons
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
  }

  return { contract, snapshot, databases };
})(ShippingLoader);
