import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import tools from '/imports/startup/tools/index';
import RedirectUser from '/imports/components/RedirectUser/index';
import { Contracts } from '/imports/api/contracts/index';
import { Places } from '/imports/api/places/index';
import { Containers } from '/imports/api/containers/index';
import { Series } from '/imports/api/series/index';
import { Modules } from '/imports/api/modules/index';
import { Accessories } from '/imports/api/accessories/index';

import SceneHeader from '/imports/components/SceneHeader/index';

import ShippingHistory from './ShippingHistory/index';
import Send from './Send/index';
import Receive from './Receive/index';

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleSend: false,
      toggleReceive: false,
      itemsRented: []
    }
  }

  toggleSend = () => {
    this.setState({ toggleSend: !this.state.toggleSend });
  }

  toggleReceive = () => {
    this.setState({ toggleReceive: !this.state.toggleReceive });
  }

  render() {
    return (
      <div className="page-content">
        <RedirectUser currentPage="shipping"/>
        <div className="contract">
          <SceneHeader
            master={{...this.props.contract, type: "shipping"}}
            databases={this.props.databases}

            updateMaster={this.updateContract}
            cancelMaster={this.cancelContract}
            saveMaster={this.saveEdits}

            errorKeys={[]}
            disabled={true}
          />
          <h3 style={{textAlign: "center", margin: "20px"}}>Histórico de Remessas</h3>
          <ShippingHistory
            shipping={this.props.contract.shipping}
            toggleSend={this.toggleSend}
            toggleReceive={this.toggleReceive}
          />
          {this.state.toggleSend ?
            <Send
              toggleSend={this.toggleSend}
              databases={this.props.databases}
              contract={this.props.contract}
            />
          : null}
          {this.state.toggleReceive ?
            <Receive
              toggleReceive={this.toggleReceive}
              databases={this.props.databases}
              contract={this.props.contract}
            />
          : null}
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

  Meteor.subscribe('containersPub');
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('modulesPub');
  Meteor.subscribe('accessoriesPub');

  var contract = Contracts.findOne({ _id: props.match.params.contractId });
  var placesDatabase = Places.find().fetch();

  var containersDatabase = Containers.find().fetch();
  var seriesDatabase = Series.find().fetch();
  var modulesDatabase = Modules.find().fetch();
  var accessoriesDatabase = Accessories.find().fetch();

  var databases = {
    placesDatabase: Places.find().fetch(),
    containersDatabase: Containers.find().fetch(),
    seriesDatabase: Series.find().fetch(),
    modulesDatabase: Modules.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch()
  }

  return { contract, databases }

})(ShippingLoader);