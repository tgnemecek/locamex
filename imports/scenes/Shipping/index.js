import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
import { Places } from '/imports/api/places/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';
import { Packs } from '/imports/api/packs/index';

import MainHeader from '/imports/components/MainHeader/index';
import FooterButtons from '/imports/components/FooterButtons/index';

import StockTransition from './StockTransition/index';
// import CurrentlyRented from './CurrentlyRented/index';
// import ShippingHistory from './ShippingHistory/index';
import Send from './Send/index';
// import Receive from './Receive/index';

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
  //
  // toggleReceive = () => {
  //   this.setState({ toggleReceive: !this.state.toggleReceive });
  // }

  currentlyRented = () => {
    return {
      series: [],
      packs: [],
      accessories: []
    };
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
          <h3 style={{textAlign: "center", margin: "20px"}}>
            Itens no Cliente
          </h3>
          {/* <CurrentlyRented
            accessoriesDatabase={this.props.databases.accessoriesDatabase}
            currentlyRented={this.currentlyRented()}
            prepareList={this.prepareList}
          /> */}
          <h3 style={{textAlign: "center", margin: "20px"}}>Histórico de Remessas</h3>
          {/* <ShippingHistory
            contract={this.props.contract}
            accessoriesDatabase={this.props.databases.accessoriesDatabase}
            placesDatabase={this.props.databases.placesDatabase}
            prepareList={this.prepareList}
          /> */}
          {this.state.toggleSend ?
            <Send
              toggleSend={this.toggleSend}
              databases={this.props.databases}
              contract={this.props.contract}
              snapshot={this.props.snapshot}
              StockTransition={StockTransition}
              currentlyRented={this.currentlyRented()}
            />
          : null}
          {this.state.toggleReceive ?
            <Receive
              toggleReceive={this.toggleReceive}
              databases={this.props.databases}
              contract={{...this.props.contract}}
              currentlyRented={this.currentlyRented()}
            />
          : null}
          <FooterButtons buttons={[
            {text: "Enviar Itens", className: "button--secondary", onClick: this.toggleSend},
            {text: "Receber Itens", className: "button--secondary", onClick: this.toggleReceive},
          ]}/>
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
  Meteor.subscribe('accessoriesPub');
  Meteor.subscribe('packsPub');

  var contract = Contracts.findOne({
    _id: props.match.params.contractId });

  var databases = {
    placesDatabase: Places.find().fetch(),
    seriesDatabase: Series.find().fetch(),
    modulesDatabase: Modules.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch(),
    packsDatabase: Packs.find().fetch()
  }

  var snapshot;

  if (contract) {
    snapshot = contract.snapshots.find((item) => {
      return item.active;
    })
  }

  return { contract, snapshot, databases }

})(ShippingLoader);