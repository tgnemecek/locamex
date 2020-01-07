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
import FooterButtons from '/imports/components/FooterButtons/index';

import CurrentlyRented from './CurrentlyRented/index';
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

  currentlyRented = () => {
    var currentlyRented = {
      fixed: [],
      accessories: [],
      modules: []
    };
    const findItem = (productId) => {
      var all = currentlyRented.fixed.concat(
        currentlyRented.accessories, currentlyRented.modules
      );
      return all.find((item) => {
        return item.productId === productId;
      })
    }

    this.props.contract.shipping.forEach((registry) => {
      registry.fixed.forEach((item) => {
        if (registry.type === "send") {
          var found = findItem(item.productId);
          if (!found) {
            currentlyRented.fixed.push(item);
          }
        } else if (registry.type === "receive") {
          for (var i = 0; i < currentlyRented.fixed.length; i++) {
            if (currentlyRented.fixed[i]._id === item._id) {
              currentlyRented.fixed.splice(i, 1);
              break;
            }
          }
        }
      })
      registry.accessories.forEach((item) => {
        var found = findItem(item.productId);
        if (!found) {
          currentlyRented.accessories.push({
            ...item,
            selected: item.selected.reduce((acc, cur) => {
              return acc + cur.selected;
            }, 0)
          });
        } else {
          var selected = item.selected.reduce((acc, cur) => {
            return acc + cur.selected;
          }, 0)

          if (registry.type === "receive") {
            selected = -selected;
          }
          found.selected += selected;
        }
      })
      registry.modules.forEach((item) => {
        var found = findItem(item.productId);
        if (!found) {
          currentlyRented.modules.push({
            ...item,
            selected: item.selected.reduce((acc, cur) => {
              return acc + cur.selected;
            }, 0)
          });
        } else {
          var selected = item.selected.reduce((acc, cur) => {
            return acc + cur.selected;
          }, 0)

          if (registry.type === "receive") {
            selected = -selected;
          }
          found.selected += selected;
        }
      })
    })
    return currentlyRented;
  }

  render() {
    return (
      <div className="page-content">
        <RedirectUser currentPage="shipping"/>
        <div className="base-scene shipping">
          <SceneHeader
            master={{...this.props.contract, type: "shipping"}}
            databases={this.props.databases}
            snapshots={this.props.contract ? this.props.contract.snapshots : []}

            updateMaster={this.updateContract}
            cancelMaster={this.cancelContract}
            saveMaster={this.saveEdits}

            errorKeys={[]}
            disabled={true}
          />
          <h3 style={{textAlign: "center", margin: "20px"}}>
            Itens no Cliente
          </h3>
          <CurrentlyRented
            contract={this.props.contract}
            currentlyRented={this.currentlyRented()}
          />
          <h3 style={{textAlign: "center", margin: "20px"}}>Histórico de Remessas</h3>
          <ShippingHistory
            contract={this.props.contract}
            accessoriesDatabase={this.props.databases.accessoriesDatabase}
            placesDatabase={this.props.databases.placesDatabase}
          />
          {this.state.toggleSend ?
            <Send
              toggleSend={this.toggleSend}
              databases={this.props.databases}
              contract={this.props.contract}
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
  Meteor.subscribe('usersPub');
  Meteor.subscribe('containersPub');
  Meteor.subscribe('seriesPub');
  Meteor.subscribe('modulesPub');
  Meteor.subscribe('accessoriesPub');

  var contract = Contracts.findOne({ _id: props.match.params.contractId });
  if (contract) {
    contract = tools.explodeContract(contract);
  }

  var databases = {
    placesDatabase: Places.find().fetch(),
    usersDatabase: Meteor.users.find().fetch(),
    containersDatabase: Containers.find().fetch(),
    seriesDatabase: Series.find().fetch(),
    modulesDatabase: Modules.find().fetch(),
    accessoriesDatabase: Accessories.find().fetch()
  }

  return { contract, databases }

})(ShippingLoader);