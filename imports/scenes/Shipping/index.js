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
      toggleReceive: false
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
      packs: []
    };
    const findItem = (productId, otherValue, otherKey) => {
      var all = currentlyRented.fixed.concat(
        currentlyRented.accessories, currentlyRented.packs
      );
      return all.find((item) => {
        if (item.productId === productId) {
          if (otherValue !== undefined) {
            return item[otherKey] === otherValue;
          } else return true;
        };
      })
    }

    this.props.contract.shipping.forEach((registry) => {
      registry.fixed.forEach((item) => {
        if (registry.type === "send") {
          var found = findItem(item.productId, item.seriesId, "seriesId");
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
        item.selected.forEach((selection) => {
          var found = findItem(item.productId, selection.variationIndex, "variationIndex");
          if (!found) {
            currentlyRented.accessories.push({
              ...item,
              variationIndex: selection.variationIndex,
              selected: selection.selected
            });
          } else {
            var selected = selection.selected;
            if (registry.type === "receive") {
              selected = -selected;
            }
            found.selected += selected;
          }
        })
      })
      registry.packs.forEach((item, j) => {
        var found = findItem(item.productId, item.label, "label");
        if (!found) {
          if (registry.type === "send") {
            currentlyRented.packs.push({
              ...item,
              modules: item.modules.map((module) => {
                return {
                  ...module,
                  selected: module.selected.reduce((acc, cur) => {
                    return acc + cur.selected;
                  }, 0)
                }
              })
            });
          }
        } else {
          var modules = item.modules.map((newModule) => {
            var foundModule = found.modules.find((obj) => {
              return obj.productId === newModule.productId;
            })
            if (foundModule) {
              var increment;
              if (Array.isArray(newModule.selected)) {
                increment = newModule.selected.reduce((acc, cur) => {
                  return acc + cur.selected;
                }, 0)
              } else increment = newModule.selected;
              if (registry.type === "receive") {
                increment = -increment;
              }
              foundModule.selected += increment;
            }
          })
        }
      })
      })
      currentlyRented.packs = currentlyRented.packs.filter((item) => {
        item.modules = item.modules.filter((module) => {
          return module.selected > 0;
        })
        return item.modules.length;
    })
    return currentlyRented;
  }

  prepareList = (item, showPlace) => {
    if (!item || !this.props.databases.placesDatabase) return [];
    var fixed = item.fixed ? item.fixed.map((item) => {
      var place = "";
      if (showPlace) {
        var place = this.props.databases.placesDatabase.find((p) => {
          return item.place === p._id;
        });
        place = place ? place.description : "";
      }
      return {
        quantity: 1,
        description: item.description,
        place,
        series: item.seriesId
      }
    }) : [];
    var accessories = [];
    item.accessories ? item.accessories.forEach((item) => {
      var quantity;
      var description;
      item.selected.forEach((selected) => {
        var placeDescription = "";
        if (showPlace) {
          this.props.databases.placesDatabase.forEach((place) => {
            if (place._id === selected.place) {
              placeDescription = place.description
            }
          });
        }

        var variationDescription = "";
        this.props.databases.accessoriesDatabase.forEach((product) => {
          if (product._id === item.productId) {
            if (product.variations.length > 1) {
              variationDescription =
                "Padrão " +
                tools.convertToLetter(selected.variationIndex);
            } else {
              variationDescription = "Padrão Único";
            }
          }
        })
        quantity = selected.selected;
      })
      accessories.push({
        quantity,
        description: item.description,
        place: placeDescription,
        variation: variationDescription
      })
    }) : [];
    var packs = [];
    item.packs ? item.packs.forEach((pack) => {
      var subList = [];
      pack.modules.forEach((item) => {
        var quantity;
        var description;
        var place;
        if (Array.isArray(item.selected)) {
          item.selected.forEach((selected) => {
            var place = "";
            if (showPlace) {
              place = this.props.databases.placesDatabase.find((place) => {
                return place._id === selected.place;
              });
              place = place ? place.description : "";
            }
            quantity = selected.selected,
            description = item.description;
            subList.push({
              quantity,
              description,
              place
            })
          })
        } else {
          subList.push({
            quantity: item.selected,
            description: item.description,
            place: ""
          })
        }
      })
      packs.push({
        quantity: 1,
        description: pack.description,
        label: pack.label,
        subList
      })
    }) : [];
    return fixed.concat(accessories, packs);
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