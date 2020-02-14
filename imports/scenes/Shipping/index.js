import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
import { Places } from '/imports/api/places/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Containers } from '/imports/api/containers/index';
import { Accessories } from '/imports/api/accessories/index';
import { Packs } from '/imports/api/packs/index';

import MainHeader from '/imports/components/MainHeader/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import StockTransition from './StockTransition/index';
import CurrentlyRented from './CurrentlyRented/index';
import ShippingHistory from './ShippingHistory/index';
import Send from './Send/index';
import Receive from './Receive/index';
import ModuleList from './ModuleList/index';

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleSend: false,
      toggleReceive: false
    }
  }

  toggleSend = () => {
    this.setState({
      toggleSend: !this.state.toggleSend
    });
  }

  toggleReceive = () => {
    this.setState({ toggleReceive: !this.state.toggleReceive
    });
  }

  currentlyRented = () => {
    var allSends = {
      series: [],
      accessories: [],
      packs: []
    }
    var allReceives = {
      series: [],
      accessories: [],
      packs: []
    }
    var currently = {};
    this.props.contract.shipping.forEach((shipping) => {
      if (shipping.type === "send") {
        allSends.series = allSends.series
                          .concat(shipping.series)
        allSends.accessories = allSends.accessories
                          .concat(shipping.accessories)
        allSends.packs = allSends.packs
                          .concat(shipping.packs)
      } else {
        allReceives.series = allReceives.series
                          .concat(shipping.series)
        allReceives.accessories = allReceives.accessories
                          .concat(shipping.accessories)
        allReceives.packs = allReceives.packs
                          .concat(shipping.packs)
      }
    })
    // Series --------------------------------------------
    currently.series = allSends.series.filter((itemSent) => {
      return !allReceives.series.find((itemReceived) => {
        return itemReceived._id === itemSent._id
      })
    })
    // Accessories ---------------------------------------
    currently.accessories = [];
    var variations = [];
    allSends.accessories.forEach((accessory) => {
      accessory.variations.forEach((variation) => {
        variations.push({
          ...variation,
          accessory: {
            _id: accessory._id,
            description: accessory.description
          },
          renting: variation.from.reduce((acc, item) => {
            return acc + item.renting;
          }, 0)
        })
      })
    })

    var filteredVariations = [];
    variations.forEach((variation, i) => {
      var found = filteredVariations.findIndex((vari) => {
        return vari._id === variation._id;
      })
      if (found > -1) {
        filteredVariations[found].renting += variation.renting;
      } else filteredVariations.push(variation);
    })
    filteredVariations.forEach((variation) => {
      allReceives.accessories.forEach((acc) => {
        acc.forEach((vari) => {
          if (vari._id === variation._id) {
            variation.renting -= vari.returning;
          }
        })
      })
    })
    currently.accessories = filteredVariations.filter((item) => {
      return item.renting > 0;
    })
    // Packs ---------------------------------------------
    currently.packs = allSends.packs.filter((itemSent) => {
      return !allReceives.packs.find((itemReceived) => {
        return itemReceived._id === itemSent._id
      })
    }).map((item) => {
      return {...item, place: {}, unmount: true}
    })
    return currently;
  }

  render() {
    return (
      <div className="page-content">
        <RedirectUser currentPage="shipping"/>
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
              currentlyRented={this.currentlyRented()}
            />
            <ShippingHistory
              shipping={this.props.contract.shipping}
            />
            {this.state.toggleSend ?
              <Send
                toggleSend={this.toggleSend}
                databases={this.props.databases}
                contract={this.props.contract}
                snapshot={this.props.snapshot}
                StockTransition={StockTransition}
                ModuleList={ModuleList}
                currentlyRented={this.currentlyRented()}
              />
            : null}
            {this.state.toggleReceive ?
              <Receive
                toggleReceive={this.toggleReceive}
                databases={this.props.databases}
                ModuleList={ModuleList}
                StockTransition={StockTransition}
                currentlyRented={this.currentlyRented()}
              />
            : null}
            <FooterButtons buttons={[
              {text: "Enviar Itens", className: "button--secondary", onClick: this.toggleSend},
              {text: "Receber Itens", className: "button--secondary", onClick: this.toggleReceive},
            ]}/>
          </div>
        </div>
      </div>
    )
  }
}

function ShippingLoader(props) {
  if (props.contract) {
    return <Shipping {...props}/>
  } else return null;
}

export default ShippingWrapper = withTracker((props) => {
  Meteor.subscribe('contractsPub');
  Meteor.subscribe('placesPub');
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('modulesPub');
  Meteor.subscribe('containersPub');
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('packsPub');

  var contract = Contracts.findOne({
    _id: props.match.params.contractId });

  var databases = {
    placesDatabase: Places.find().fetch(),
    seriesDatabase: Series.find().fetch(),
    modulesDatabase: Modules.find().fetch(),
    containersDatabase: Containers.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    packsDatabase: Packs.find({rented: false}).fetch()
  }

  var snapshot;

  if (contract) {
    snapshot = contract.snapshots.find((item) => {
      return item.active;
    })
  }

  return { contract, snapshot, databases }

})(ShippingLoader);